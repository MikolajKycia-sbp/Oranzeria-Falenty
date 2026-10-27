"""Eksport modelu Rhino (.3dm) do danych dla strony (data/model-data.js).

Uzycie:  python export_model.py <plik.3dm> <wyjscie.js>
Wymaga:  pip install rhino3dm

Elementy interaktywne = obiekty z warstw "Stan zachowania::*":
  - wstawienia blokow "Stan - <nazwa>"  -> ID = <nazwa> (z nazwy bloku),
  - obiekty bez bloku                   -> ID nadawane automatycznie: <nazwa obiektu przed "|">
    (lub nazwa elementu-gospodarza z warstw "Oranzeria::*", gdy obiekt nie ma nazwy),
    z sufiksem .1, .2 ... gdy nazwa sie powtarza.
Gdy czlonkowie jednego bloku leza na roznych warstwach stanu, blok dzielony jest
na wiersze <nazwa>.1, <nazwa>.2 ... (po jednym na kazdy stan).
"""
import sys, json, base64, re, struct
import rhino3dm as r

STATE_ROOT = 'Stan zachowania'
MAT_ROOT = 'Oranzeria'
PREFIX = 'Stan - '

f = r.File3dm.Read(sys.argv[1])
out_path = sys.argv[2]
layers = [f.Layers[i] for i in range(len(f.Layers))]
LP = lambda i: layers[i].FullPath
byid = {o.Attributes.Id: o for o in f.Objects}
SCALE = {r.UnitSystem.Millimeters: 0.001, r.UnitSystem.Centimeters: 0.01, r.UnitSystem.Meters: 1.0}[f.Settings.ModelUnitSystem]

# ---- stany (warstwy "Stan zachowania::...") ----
states = []
for i, L in enumerate(layers):
    p = L.FullPath
    if not p.startswith(STATE_ROOT + '::'):
        continue
    label = p.split('::', 1)[1]
    m = re.match(r'Ocena (\d+) - (.+)', label)
    states.append({
        'layer': p, 'key': label,
        'grade': int(m.group(1)) if m else None,
        'label': m.group(2) if m else label,
        'color': '#%02x%02x%02x' % tuple(L.Color[:3]),
    })
state_by_layer = {s['layer']: s for s in states}

def xf_point(xf, x, y, z):
    if xf is None:
        return x, y, z
    w = xf.M30 * x + xf.M31 * y + xf.M32 * z + xf.M33
    return ((xf.M00 * x + xf.M01 * y + xf.M02 * z + xf.M03) / w,
            (xf.M10 * x + xf.M11 * y + xf.M12 * z + xf.M13) / w,
            (xf.M20 * x + xf.M21 * y + xf.M22 * z + xf.M23) / w)

def meshes_of(g):
    if isinstance(g, r.Brep):
        res = []
        for fc in g.Faces:
            m = fc.GetMesh(r.MeshType.Render) or fc.GetMesh(r.MeshType.Any)
            if m is None:
                raise RuntimeError('Brep bez siatki renderujacej')
            res.append(m)
        return res
    if isinstance(g, r.Extrusion):
        m = g.GetMesh(r.MeshType.Render) or g.GetMesh(r.MeshType.Any)
        if m is None:
            raise RuntimeError('Extrusion bez siatki')
        return [m]
    if isinstance(g, r.Mesh):
        return [g]
    return []

def tri_soup(g, xf):
    """Zwraca (pozycje [x,y,z,...] w metrach, ukladzie Y-up; indeksy)."""
    pos, idx = [], []
    for m in meshes_of(g):
        base = len(pos) // 3
        V = m.Vertices
        for k in range(len(V)):
            p = V[k]
            x, y, z = xf_point(xf, p.X, p.Y, p.Z)
            pos += [x * SCALE, z * SCALE, -y * SCALE]   # Rhino Z-up -> three.js Y-up
        F = m.Faces
        for k in range(len(F)):
            a, b, c, d = F[k]
            idx += [base + a, base + b, base + c]
            if c != d:
                idx += [base + a, base + c, base + d]
    return pos, idx

def bbox_key(g, xf=None):
    b = g.GetBoundingBox()
    pts = [xf_point(xf, b.Min.X, b.Min.Y, b.Min.Z), xf_point(xf, b.Max.X, b.Max.Y, b.Max.Z)]
    return tuple(round(v, 1) for p in pts for v in p)

def split_name(n):
    n = (n or '').strip()
    if '|' in n:
        a, b = n.split('|', 1)
        return a.strip(), b.strip()
    return n, ''

# ---- kolory "materialowe" z warstw Oranzeria::* (dopasowanie po bboxie) ----
mat_color = {}
for o in f.Objects:
    a = o.Attributes
    lp = LP(a.LayerIndex)
    if not lp.startswith(MAT_ROOT + '::'):
        continue
    col = '#%02x%02x%02x' % tuple(layers[a.LayerIndex].Color[:3])
    if a.IsInstanceDefinitionObject:
        continue
    g = o.Geometry
    if isinstance(g, r.InstanceReference):
        d = f.InstanceDefinitions.FindId(g.ParentIdefId)
        for i in d.GetObjectIds():
            mo = byid[i]
            mc = '#%02x%02x%02x' % tuple(layers[mo.Attributes.LayerIndex].Color[:3])
            mat_color[bbox_key(mo.Geometry, g.Xform)] = mc
    else:
        mat_color[bbox_key(g)] = (col, split_name(a.Name)[0])
mat_hosts = [(k, v[1], v[0]) for k, v in mat_color.items() if isinstance(v, tuple)]

def material_for(g, xf=None):
    k = bbox_key(g, xf)
    v = mat_color.get(k)
    if isinstance(v, tuple):
        return v[0]
    if v:
        return v
    host = host_of(k)
    return host[2] if host else '#d8d2c4'

def host_of(k):
    cx, cy, cz = (k[0] + k[3]) / 2, (k[1] + k[4]) / 2, (k[2] + k[5]) / 2
    best = None
    for hk, name, col in mat_hosts:
        if hk[0] - 1 <= cx <= hk[3] + 1 and hk[1] - 1 <= cy <= hk[4] + 1 and hk[2] - 1 <= cz <= hk[5] + 1:
            vol = (hk[3] - hk[0]) * (hk[4] - hk[1]) * (hk[5] - hk[2])
            if best is None or vol < best[0]:
                best = (vol, name, col)
    return best and (best[0], best[1], best[2])

# ---- zbieranie elementow ----
raw = []   # {base, auto, state, parts:[(geom, xf, name, category)], block}
for o in f.Objects:
    a = o.Attributes
    if a.IsInstanceDefinitionObject:
        continue
    lp = LP(a.LayerIndex)
    if not lp.startswith(STATE_ROOT + '::'):
        continue
    g = o.Geometry
    if isinstance(g, r.InstanceReference):
        d = f.InstanceDefinitions.FindId(g.ParentIdefId)
        bname = d.Name[len(PREFIX):] if d.Name.startswith(PREFIX) else d.Name
        groups = {}
        for i in d.GetObjectIds():
            mo = byid[i]
            ma = mo.Attributes
            mlp = LP(ma.LayerIndex)
            # czlonek na warstwie stanu -> jej stan; czlonek na innej warstwie (np. Default) -> stan wstawienia
            st = mlp if mlp in state_by_layer else lp
            if mlp in state_by_layer and mlp != lp and ma.ColorSource == r.ObjectColorSource.ColorFromParent:
                print('UWAGA: %s / %s lezy na "%s", ale kolor ma z rodzica ("%s")' % (d.Name, ma.Name, mlp, lp))
            nm, cat = split_name(ma.Name)
            groups.setdefault(st, []).append((mo.Geometry, g.Xform, nm, cat))
        for st, parts in groups.items():
            raw.append({'base': bname, 'auto': False, 'block': d.Name, 'state': st,
                        'parts': parts, 'split': len(groups) > 1})
    elif isinstance(g, (r.Brep, r.Extrusion, r.Mesh)):
        nm, cat = split_name(a.Name)
        auto = False
        if not nm:
            h = host_of(bbox_key(g))
            nm = h[1] if h else 'Element'
            auto = True
        raw.append({'base': nm, 'auto': True, 'block': None, 'state': lp,
                    'parts': [(g, None, nm if not auto else '', cat)], 'split': False, 'unnamed': auto})

def sort_key(e):
    g, xf = e['parts'][0][0], e['parts'][0][1]
    k = bbox_key(g, xf)
    return (k[0], k[2], k[1])

# ID: bloki -> nazwa bloku (+ .n przy podziale); pozostale -> nazwa (+ .n gdy powtorzona)
from collections import defaultdict
grp = defaultdict(list)
for e in raw:
    grp[(e['block'] is not None, e['base'])].append(e)
for (is_block, base), lst in grp.items():
    if is_block:
        lst.sort(key=lambda e: state_by_layer[e['state']]['grade'] or 99)
    else:
        lst.sort(key=sort_key)
    if len(lst) == 1:
        lst[0]['id'] = base
    else:
        for n, e in enumerate(lst, 1):
            e['id'] = '%s.%d' % (base, n)

ids = [e['id'] for e in raw]
assert len(ids) == len(set(ids)), 'Zduplikowane ID'

# ---- geometria ----
positions, indices, colors = [], [], []
elements = []
for e in sorted(raw, key=lambda e: e['id']):
    p0, i0 = len(positions) // 3, len(indices)
    parts_out = []
    for g, xf, nm, cat in e['parts']:
        pos, idx = tri_soup(g, xf)
        base = len(positions) // 3
        positions += pos
        indices += [base + k for k in idx]
        mc = material_for(g, xf)
        rgb = [int(mc[k:k + 2], 16) for k in (1, 3, 5)]
        colors += rgb * (len(pos) // 3)
        parts_out.append({'name': nm, 'category': cat})
    names = sorted({p['name'] for p in parts_out if p['name']})
    cats = sorted({p['category'] for p in parts_out if p['category']})
    elements.append({
        'id': e['id'],
        'source': 'blok' if e['block'] else 'obiekt',
        'block': e['block'],
        'autoId': e['block'] is None,
        'split': e['split'],
        'unnamed': e.get('unnamed', False),
        'stateKey': state_by_layer[e['state']]['key'],
        'parts': names, 'categories': cats, 'partCount': len(parts_out),
        'vStart': p0, 'vCount': len(positions) // 3 - p0,
        'iStart': i0, 'iCount': len(indices) - i0,
    })

materials = [{'name': L.FullPath.split('::', 1)[1], 'color': '#%02x%02x%02x' % tuple(L.Color[:3])}
             for L in layers if L.FullPath.startswith(MAT_ROOT + '::')]

b64 = lambda fmt, arr: base64.b64encode(struct.pack('<%d%s' % (len(arr), fmt), *arr)).decode()
data = {
    'source': sys.argv[1].replace('\\', '/').split('/')[-1],
    'units': 'm',
    'states': states,
    'materials': materials,
    'elements': elements,
    'geometry': {
        'positions': b64('f', positions),
        'indices': b64('I', indices),
        'colors': base64.b64encode(bytes(colors)).decode(),
    },
}
with open(out_path, 'w', encoding='utf-8') as fo:
    fo.write('/* Wygenerowane automatycznie przez tools/export_model.py - nie edytowac recznie */\n')
    fo.write('window.MODEL_DATA = ')
    json.dump(data, fo, ensure_ascii=False, separators=(',', ':'))
    fo.write(';\n')
print('elements', len(elements), 'verts', len(positions) // 3, 'tris', len(indices) // 3)
for e in elements:
    print('%-40s %-34s %-6s parts=%d %s' % (e['id'], e['stateKey'], e['source'], e['partCount'], '; '.join(e['categories'])[:70]))
