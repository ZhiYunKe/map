/* Shanghai, in miniature. An intentionally schematic, locally rendered city. */
(function () {
  'use strict';

  window.createShanghaiScene = function (options) {
    var T = window.THREE;
    var container = options.container;
    var places = options.places || [];
    var days = options.days || (window.TRIP_DATA && window.TRIP_DATA.days) || [];
    var noop = function () {};
    if (!T || !container) {
      if (options.onError) options.onError(new Error('3D 引擎未能载入'));
      return { select: noop, setDay: noop, setTheme: noop, setRouteProgress: noop, reset: noop, zoom: noop, rotate: noop, setTopView: noop, getCanvas: function () { return null; }, dispose: noop };
    }

    var renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    } catch (error) {
      if (options.onError) options.onError(error);
      return { select: noop, setDay: noop, setTheme: noop, setRouteProgress: noop, reset: noop, zoom: noop, rotate: noop, setTopView: noop, getCanvas: function () { return null; }, dispose: noop };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.07;
    renderer.domElement.className = 'sandtable-canvas';
    renderer.domElement.setAttribute('aria-label', '上海旅行三维示意沙盘，拖动旋转，滚轮缩放，点击地标查看详情');
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none;';
    renderer.domElement.tabIndex = 0;
    container.appendChild(renderer.domElement);

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(38, 1, 0.1, 300);
    var world = new T.Group();
    scene.add(world);
    var centre = new T.Vector3(-6, -1.8, 5.4);
    var target = centre.clone();
    var orbit = { theta: 0.42, phi: 0.77, distance: 100 };
    var initial = { theta: 0.42, phi: 0.77, distance: 100 };
    var activeId = null, activeDay = 'all', currentTheme = 'day', topView = false;
    var width = 1, height = 1, disposed = false, frame = 0, transition = null, journey = null;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var materials = {}, labelEntries = [], landmarks = {}, routeGroups = {}, pickMeshes = [], glowLights = [];
    var DAY_COLORS = { '3': 0xdb8a39, '4': 0x398d80, '5': 0x668da9 };
    var palettes = {
      day: { ground: 0xe8e0ce, edge: 0x456058, street: 0xf5efdf, pavement: 0xd8d5bc, building: 0xcfbea0, building2: 0xe4d7bb, building3: 0xb2bbac, roof: 0x9cac98, river: 0x367c80, ripple: 0xb4e5dc, grass: 0xa6bc87, tree: 0x5f885e, trunk: 0x89705b, white: 0xf5eed9, glass: 0x438592, glassDark: 0x315761, window: 0xeac785, metal: 0x9eb3ac, dark: 0x3b504a, red: 0xc84d31, redDark: 0x813326, gold: 0xc7a05d, robot: 0xede4d1, robotDark: 0x3e5667, robotGlow: 0x48bba4, track: 0x60716c, cream: 0xe6c697 },
      night: { ground: 0x293e46, edge: 0x142d35, street: 0x37565e, pavement: 0x304a50, building: 0x415766, building2: 0x4c6770, building3: 0x365359, roof: 0x293f45, river: 0x113e51, ripple: 0x78b8c1, grass: 0x305747, tree: 0x2f6350, trunk: 0x48483e, white: 0xd8ded3, glass: 0x307d94, glassDark: 0x193a4d, window: 0xffc77b, metal: 0x819fa5, dark: 0x203740, red: 0xc8613f, redDark: 0x693434, gold: 0xdbb574, robot: 0xb7cfd4, robotDark: 0x243f54, robotGlow: 0x6af7db, track: 0x566976, cream: 0xd4c094 }
    };
    function material(name, extra) {
      if (!materials[name]) {
        materials[name] = new T.MeshStandardMaterial(Object.assign({ color: palettes.day[name] || 0xffffff, roughness: .82, metalness: .03 }, extra || {}));
      }
      return materials[name];
    }
    function mesh(geometry, mat, parent, x, y, z) {
      var m = new T.Mesh(geometry, typeof mat === 'string' ? material(mat) : mat);
      m.position.set(x || 0, y || 0, z || 0);
      m.castShadow = true; m.receiveShadow = true;
      (parent || world).add(m);
      return m;
    }
    function box(w, h, d, mat, parent, x, y, z) { return mesh(new T.BoxGeometry(w, h, d), mat, parent, x, y, z); }
    function cylinder(rt, rb, h, mat, parent, x, y, z, segments) { return mesh(new T.CylinderGeometry(rt, rb, h, segments || 16), mat, parent, x, y, z); }
    function sphere(r, mat, parent, x, y, z, detail) { return mesh(new T.SphereGeometry(r, detail || 16, Math.max(8, (detail || 16) / 2)), mat, parent, x, y, z); }
    function roundedShape(x, z, w, d, r) {
      var s = new T.Shape();
      s.moveTo(x + r, z); s.lineTo(x + w - r, z); s.quadraticCurveTo(x + w, z, x + w, z + r);
      s.lineTo(x + w, z + d - r); s.quadraticCurveTo(x + w, z + d, x + w - r, z + d);
      s.lineTo(x + r, z + d); s.quadraticCurveTo(x, z + d, x, z + d - r);
      s.lineTo(x, z + r); s.quadraticCurveTo(x, z, x + r, z); return s;
    }
    function line(points, color, parent, opacity) {
      var geo = new T.BufferGeometry().setFromPoints(points);
      var ln = new T.Line(geo, new T.LineBasicMaterial({ color: color, transparent: opacity !== undefined, opacity: opacity === undefined ? 1 : opacity }));
      (parent || world).add(ln); return ln;
    }
    function stick(a, b, radius, mat, parent) {
      var direction = b.clone().sub(a);
      var m = cylinder(radius, radius, direction.length(), mat, parent, 0, 0, 0, 8);
      m.position.copy(a).add(b).multiplyScalar(.5);
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize()); return m;
    }
    function point(p) { return { x: Number(p.position[0]) * 3, z: Number(p.position[1]) * 3 }; }

    var hemi = new T.HemisphereLight(0xfff8e9, 0x7b8b7b, 2.2); scene.add(hemi);
    var sun = new T.DirectionalLight(0xffe6bd, 2.8); sun.position.set(-24, 42, 23);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -52; sun.shadow.camera.right = 52;
    sun.shadow.camera.top = 44; sun.shadow.camera.bottom = -44;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 125;
    sun.shadow.normalBias = .08; sun.shadow.bias = -.0003;
    sun.shadow.radius = 4; sun.target.position.copy(centre); scene.add(sun.target); scene.add(sun);
    var fill = new T.DirectionalLight(0xbad7dd, .9); fill.position.set(30, 20, -35); scene.add(fill);

    /* A chamfered physical model base, rather than a supposedly accurate map. */
    var baseShape = roundedShape(-40, -23, 68, 46, 2);
    var base = mesh(new T.ExtrudeGeometry(baseShape, { depth: 1.45, bevelEnabled: true, bevelSize: .32, bevelThickness: .22, bevelSegments: 3, steps: 1 }), 'ground', world);
    base.rotation.x = -Math.PI / 2; base.position.y = -1.72;
    var lower = mesh(new T.ExtrudeGeometry(roundedShape(-40.15, -23.15, 68.3, 46.3, 2.1), { depth: .7, bevelEnabled: true, bevelSize: .25, bevelThickness: .15, bevelSegments: 3 }), 'edge', world);
    lower.rotation.x = -Math.PI / 2; lower.position.y = -2.5;
    var floor = mesh(new T.PlaneGeometry(350, 350), new T.ShadowMaterial({ color: 0x384c45, opacity: .23 }), scene, 0, -3.2, 0);
    floor.rotation.x = -Math.PI / 2; floor.castShadow = false;

    function riverX(z) { return 1.1 + Math.sin((z + 2) / 13) * 1.7 + Math.sin(z / 7) * .3; }
    var riverShape = new T.Shape();
    for (var ri = 0; ri <= 90; ri++) {
      var rz = -22.95 + ri * 45.9 / 90;
      var rx = riverX(rz) - 2.05;
      if (ri === 0) riverShape.moveTo(rx, -rz); else riverShape.lineTo(rx, -rz);
    }
    for (var rj = 90; rj >= 0; rj--) { var zz = -22.95 + rj * 45.9 / 90; riverShape.lineTo(riverX(zz) + 2.05, -zz); }
    var water = mesh(new T.ShapeGeometry(riverShape), material('river', { roughness: .36, metalness: .15 }), world, 0, .04, 0);
    water.rotation.x = -Math.PI / 2; water.castShadow = false;
    [-2.2, 2.2].forEach(function (offset) {
      var pts = [];
      for (var i = 0; i <= 80; i++) { var z = -22.8 + i * 45.6 / 80; pts.push(new T.Vector3(riverX(z) + offset, .11, z)); }
      var riverBank = mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 100, .09, 5, false), 'white'); riverBank.castShadow = false;
    });
    for (var wr = 0; wr < 20; wr++) {
      var wz = -21 + wr * 2.2, wx = riverX(wz);
      line([new T.Vector3(wx - .75, .1, wz), new T.Vector3(wx + .1, .1, wz + .22)], palettes.day.ripple, world, .65).userData.ripple = true;
    }

    /* Streets, lawns and quiet background blocks form a legible miniature city. */
    [-19, -12, -4, 4, 12, 20].forEach(function (z) {
      box(35.6, .05, .6, 'street', world, -21.2, .015, z);
      box(20.1, .05, .6, 'street', world, 16.8, .015, z);
    });
    [-36, -28, -20, -12, -5, 8, 16, 24].forEach(function (x) {
      box(.6, .05, 43, 'street', world, x, .016, 0);
    });
    var roadBridge = new T.Group(); world.add(roadBridge);
    [-16.4, 9.2].forEach(function (z) {
      var x = riverX(z);
      box(7.4, .26, .88, 'white', roadBridge, x, .45, z);
      box(7.2, .035, .51, 'street', roadBridge, x, .6, z);
      for (var i = -1; i <= 1; i += 2) {
        box(6.8, .13, .065, 'metal', roadBridge, x, .9, z + i * .4);
        [-2.7, 2.7].forEach(function (xx) { box(.2, .76, .7, 'pavement', roadBridge, x + xx, .15, z); });
      }
    });
    var randomSeed = 97;
    function rand() { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; }
    function nearPlace(x, z) {
      if ((Math.abs(x + 31) < 4.8 && Math.abs(z - 14) < 3.1) || (Math.abs(x + 13) < 4 && Math.abs(z + 13.8) < 2.8) || (Math.abs(x - 18.5) < 3.8 && Math.abs(z - 8.7) < 2.7) || (Math.abs(x + 7.4) < 3 && Math.abs(z - 11.9) < 2.8)) return true;
      for (var i = 0; i < places.length; i++) {
        var pp = point(places[i]), airport = places[i].kind === 'airport';
        if (Math.abs(x - pp.x) < (airport ? 6.2 : 3.8) && Math.abs(z - pp.z) < (airport ? 4.8 : 3.2)) return true;
      }
      return false;
    }
    var backgroundMeshes = [];
    var blockGeometries = [new T.BoxGeometry(1, 1, 1), new T.BoxGeometry(1, 1, 1), new T.BoxGeometry(1, 1, 1)];
    for (var groupIndex = 0; groupIndex < 3; groupIndex++) {
      var instance = new T.InstancedMesh(blockGeometries[groupIndex], material(['building', 'building2', 'building3'][groupIndex]), 180);
      instance.castShadow = true; instance.receiveShadow = true;
      world.add(instance); backgroundMeshes.push(instance);
    }
    var counts = [0, 0, 0], dummy = new T.Object3D();
    for (var xx = -36; xx < 26; xx += 4.1) {
      for (var zzz = -20; zzz < 22; zzz += 4.1) {
        var bx = xx + (rand() - .5) * .55, bz = zzz + (rand() - .5) * .5;
        if (Math.abs(bx - riverX(bz)) < 4.5 || nearPlace(bx, bz) || rand() > .64) continue;
        var bh = .45 + rand() * .95, bw = 1.25 + rand() * 1.5, bd = 1.1 + rand() * 1.4;
        if (bx > 8 && bz < 5 && rand() > .65) bh += 1.8;
        var bi = Math.floor(rand() * 3);
        if (counts[bi] >= 180) continue;
        dummy.position.set(bx, bh / 2 + .03, bz); dummy.scale.set(bw, bh, bd); dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
        backgroundMeshes[bi].setMatrixAt(counts[bi]++, dummy.matrix);
      }
    }
    backgroundMeshes.forEach(function (b, i) { b.count = counts[i]; b.instanceMatrix.needsUpdate = true; });
    function tree(x, z, size, parent) {
      cylinder(.075 * size, .095 * size, .65 * size, 'trunk', parent || world, x, .3 * size, z, 5);
      var crown = mesh(new T.IcosahedronGeometry(.51 * size, 1), 'tree', parent || world, x, .93 * size, z);
      crown.scale.y = 1.1;
    }
    function garden(x, z, w, d, rows) {
      var lawn = mesh(new T.ShapeGeometry(roundedShape(-w / 2, -d / 2, w, d, .65)), 'grass', world, x, .063, z);
      lawn.rotation.x = -Math.PI / 2; lawn.castShadow = false;
      box(w * .72, .023, .26, 'pavement', world, x, .091, z);
      for (var row = -1; row <= 1; row += 2) for (var t = 0; t < rows; t++) {
        tree(x - w * .32 + t * w * .64 / Math.max(1, rows - 1), z + row * d * .31, .62 + (t % 2) * .13);
      }
      [-1, 1].forEach(function (side) { box(.63, .12, .22, 'cream', world, x + side * w * .26, .2, z + .36); });
    }
    garden(-31, 14, 8.1, 5.1, 4);
    garden(-13, -13.8, 6.6, 4.3, 3);
    garden(18.5, 8.7, 6.2, 4.2, 3);
    garden(-7.4, 11.9, 4.6, 4.3, 3);
    for (var t = 0; t < 22; t++) {
      var tz = -21.5 + t * 2.04;
      [-1, 1].forEach(function (side) {
        var tx = riverX(tz) + side * 2.9;
        if (!nearPlace(tx, tz) && Math.abs(tz - 9.2) > 1.4 && Math.abs(tz + 16.4) > 1.4) tree(tx, tz, .65);
      });
    }
    function surfaceText(text, x, z, size, rotation) {
      var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 160;
      var ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#75877c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '500 65px "Segoe UI", "Microsoft YaHei", sans-serif'; ctx.fillText(text, 512, 80);
      var texture = new T.CanvasTexture(cv); texture.colorSpace = T.SRGBColorSpace;
      var label = mesh(new T.PlaneGeometry(size, size / 6.4), new T.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: .62 }), world, x, .09, z);
      label.rotation.set(-Math.PI / 2, 0, rotation || 0); label.castShadow = false; label.receiveShadow = false;
    }
    surfaceText('P U X I   浦 西', -22, -21.3, 10.6);
    surfaceText('P U D O N G   浦 东', 17.7, 21.7, 10.3);
    surfaceText('H U A N G P U', riverX(18.4), 18.4, 6.2, Math.PI / 2);

    /* Buildings are individually modelled silhouettes, not geospatial assets. */
    function makeTower(g) {
      var n = 24, levels = 45, vertices = [], indices = [], towerHeight = 10.7;
      var tx = .7, tz = .2;
      for (var j = 0; j <= levels; j++) {
        var f = j / levels, taper = 1 - .36 * f, twist = f * .92;
        for (var k = 0; k < n; k++) {
          var a = k / n * Math.PI * 2;
          var radius = (1.07 + .085 * Math.cos(a * 3)) * taper;
          vertices.push(tx + Math.cos(a + twist) * radius, .24 + f * towerHeight, tz + Math.sin(a + twist) * radius * .86);
        }
      }
      for (var lev = 0; lev < levels; lev++) for (var q = 0; q < n; q++) {
        var v = lev * n + q, vnext = lev * n + (q + 1) % n;
        indices.push(v, vnext, v + n, vnext, vnext + n, v + n);
      }
      var geom = new T.BufferGeometry(); geom.setAttribute('position', new T.Float32BufferAttribute(vertices, 3)); geom.setIndex(indices); geom.computeVertexNormals();
      mesh(geom, material('glass', { roughness: .23, metalness: .52, side: T.DoubleSide }), g);
      cylinder(.69, .7, .1, 'glassDark', g, tx, 11, tz, 24);
      for (var f1 = 0; f1 <= 1; f1 += .055) {
        var ring = [];
        for (var k1 = 0; k1 <= n; k1++) {
          var a1 = k1 / n * Math.PI * 2, r1 = (1.077 + .085 * Math.cos(a1 * 3)) * (1 - .36 * f1);
          ring.push(new T.Vector3(tx + Math.cos(a1 + f1 * .92) * r1, .25 + f1 * towerHeight, tz + Math.sin(a1 + f1 * .92) * r1 * .86));
        }
        line(ring, 0xe3e4d6, g, .5);
      }
      for (var side = 0; side < 6; side++) {
        var ridge = [];
        for (var rj = 0; rj <= 45; rj++) {
          var rf = rj / 45, ra = side * Math.PI / 3, rr = (1.087 + .085 * Math.cos(ra * 3)) * (1 - .36 * rf);
          ridge.push(new T.Vector3(tx + Math.cos(ra + rf * .92) * rr, .26 + rf * towerHeight, tz + Math.sin(ra + rf * .92) * rr * .86));
        }
        line(ridge, 0xd5dfd4, g, .66);
      }
      box(2.7, .22, 2.4, 'pavement', g, tx, .1, tz);
      var finance = new T.Group(); finance.position.set(-1.45, .2, -1.1); finance.rotation.y = -.15; g.add(finance);
      var profile = new T.Shape(); profile.moveTo(-.91, 0); profile.lineTo(.91, 0); profile.lineTo(.69, 9.15); profile.lineTo(-.69, 9.15); profile.closePath();
      var hole = new T.Path(); hole.moveTo(-.46, 7.64); hole.lineTo(-.41, 8.77); hole.lineTo(.41, 8.77); hole.lineTo(.46, 7.64); hole.closePath(); profile.holes.push(hole);
      var fin = mesh(new T.ExtrudeGeometry(profile, { depth: .69, bevelEnabled: true, bevelSize: .055, bevelThickness: .04, bevelSegments: 1 }), 'glassDark', finance, 0, 0, -.345);
      for (var ff = .55; ff < 7.5; ff += .42) box(1.61 - ff * .04, .025, .76, 'metal', finance, 0, ff, 0);
      for (var fy = 1.15; fy < 7.4; fy += .83) for (var fx = -1; fx <= 1; fx++) {
        box(.12, .12, .022, 'window', finance, fx * .37, fy, .37);
      }
      box(.055, 7.7, .76, 'metal', finance, 0, 3.84, 0);
      var jinmao = new T.Group(); jinmao.position.set(2.36, .1, -1.25); g.add(jinmao);
      for (var jn = 0; jn < 12; jn++) {
        var sz = 1.6 - jn * .087;
        box(sz, .54, sz, jn % 2 ? 'glassDark' : 'metal', jinmao, 0, .31 + jn * .55, 0);
        box(sz + .13, .09, sz + .13, 'gold', jinmao, 0, .62 + jn * .55, 0);
      }
      cylinder(.12, .4, 1, 'metal', jinmao, 0, 7.12, 0, 8);
      cylinder(.025, .07, 1.1, 'gold', jinmao, 0, 8.17, 0, 8);
      for (var jl = 1; jl < 11; jl++) {
        var js = 1.6 - jl * .087;
        box(js * .69, .08, .023, 'window', jinmao, 0, .41 + jl * .55, js * .5 + .012);
      }
      cylinder(2.88, 2.98, .13, 'pavement', g, .38, .055, -.55, 32);
      [-2.1, 2.1].forEach(function (x) { tree(x, 1.64, .52, g); });
      return 11.25;
    }
    function makeGallery(g) {
      box(4.6, .18, 3.1, 'pavement', g, 0, .08, 0);
      box(4.1, 1.7, 2.5, 'white', g, 0, 1, 0);
      box(4.16, .17, 2.57, 'white', g, 0, 1.94, 0);
      box(3.5, .73, .045, 'glassDark', g, 0, .9, 1.276);
      box(3.46, .43, .045, 'glass', g, 0, 1.55, 1.279);
      for (var i = -8; i <= 8; i++) box(.038, 1.4, .07, 'white', g, i * .21, 1.15, 1.32);
      box(.65, 2, 2.62, 'white', g, -1.82, 1.12, 0);
      box(.65, 2, 2.62, 'white', g, 1.82, 1.12, 0);
      box(1.7, .68, 1.45, 'white', g, .28, 2.3, -.2);
      box(1.55, .04, 1.3, 'glassDark', g, .28, 2.66, -.2);
      for (var s = 0; s < 3; s++) box(2.2 + s * .35, .09, .34, 'white', g, 0, .2 - s * .05, 1.6 + s * .25);
      tree(-2.25, -1.45, .58, g); tree(2.25, -1.45, .58, g);
      return 3.05;
    }
    function makeArt(g) {
      box(5.4, .2, 4.5, 'pavement', g, 0, .1, 0);
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (z) { box(.55, 2, .55, 'redDark', g, x, 1.16, z * .7); }); });
      box(2.5, .3, 1.9, 'redDark', g, 0, 1.44, 0);
      for (var level = 0; level < 5; level++) {
        var w = 2.7 + level * .47, d = 2 + level * .37, y = 1.8 + level * .36;
        box(w, .25, d, 'red', g, 0, y, 0);
        box(w + .23, .1, d + .2, 'redDark', g, 0, y + .17, 0);
        for (var s = -3; s <= 3; s++) {
          box(.12, .28, d + .32, 'red', g, s * (w - .2) / 7, y + .15, 0);
          box(w + .31, .28, .12, 'red', g, 0, y + .15, s * (d - .15) / 7);
        }
      }
      box(4.8, .13, 3.78, 'red', g, 0, 3.51, 0);
      for (var i = 0; i < 4; i++) box(2.2 + .4 * i, .09, .29, 'white', g, 0, .35 - i * .06, 1.4 + i * .29);
      return 4;
    }
    function makeCampus(g) {
      box(5.2, .12, 3.2, 'pavement', g, 0, .06, 0);
      box(4.2, .8, .65, 'red', g, 0, .54, -.5);
      box(1.26, 2.15, .97, 'red', g, -1.55, 1.15, 0);
      box(1.26, 2.15, .97, 'red', g, 1.55, 1.15, 0);
      box(1.35, .75, .95, 'red', g, 0, 2, 0);
      box(4.95, .2, 1.42, 'dark', g, 0, 2.5, 0);
      box(4.78, .13, 1.25, 'white', g, 0, 2.34, 0);
      box(1.62, .16, 1.34, 'dark', g, 0, 2.79, 0);
      box(1.47, .31, .97, 'red', g, 0, 2.57, 0);
      box(1.07, .28, .028, 'gold', g, 0, 2.03, .493);
      [-1.55, 1.55].forEach(function (x) { box(.55, 1.04, .025, 'dark', g, x, .89, .494); box(.68, .16, .085, 'white', g, x, 1.49, .5); });
      [-2.3, 2.3].forEach(function (x) { tree(x, -1.2, .9, g); tree(x, 1, .75, g); });
      return 3.3;
    }
    function makeHistoric(g, id) {
      if (id === 'wukang') {
        var sh = new T.Shape(); sh.moveTo(-1.6, -1.1); sh.lineTo(1.8, -.9); sh.lineTo(.12, 1.5); sh.closePath();
        var house = mesh(new T.ExtrudeGeometry(sh, { depth: 3.5, bevelEnabled: false }), 'cream', g, 0, 3.65, 0); house.rotation.x = Math.PI / 2;
        var rr = mesh(new T.ShapeGeometry(sh), material('dark', { side: T.DoubleSide }), g, 0, 3.69, 0); rr.rotation.x = Math.PI / 2;
        var corners = [[-1.6, -1.1], [1.8, -.9], [.12, 1.5]];
        corners.forEach(function (corner, index) {
          var next = corners[(index + 1) % corners.length], dx = next[0] - corner[0], dz = next[1] - corner[1];
          var facade = new T.Group(); facade.position.set((corner[0] + next[0]) / 2, 0, (corner[1] + next[1]) / 2); facade.rotation.y = -Math.atan2(dz, dx); g.add(facade);
          var length = Math.hypot(dx, dz);
          box(length + .09, .17, .12, 'redDark', facade, 0, .25, -.02);
          box(length + .09, .14, .13, 'white', facade, 0, 3.53, -.02);
          for (var floor = 0; floor < 6; floor++) {
            box(length, .045, .07, 'white', facade, 0, .68 + floor * .46, -.032);
            for (var column = -2; column <= 2; column++) {
              var cx = column * (length - .44) / 5;
              box(.24, .27, .036, 'window', facade, cx, .88 + floor * .46, -.03);
              box(.3, .035, .08, 'white', facade, cx, .73 + floor * .46, -.05);
            }
          }
        });
        return 4.05;
      }
      box(4.6, .13, 3.1, 'pavement', g, 0, .07, 0);
      for (var j = -1; j <= 1; j++) {
        box(1.35, 1.52, 1.9, 'red', g, j * 1.42, .87, 0);
        var roof = cylinder(1.03, 1.03, .28, 'dark', g, j * 1.42, 1.78, 0, 4); roof.rotation.y = Math.PI / 4; roof.scale.z = .95;
        box(.43, .9, .07, 'dark', g, j * 1.42, .57, 1);
        box(.54, .08, .16, 'white', g, j * 1.42, 1.14, 1.02);
        [-.4, .4].forEach(function (offset) { box(.23, .32, .04, 'window', g, j * 1.42 + offset, 1.36, .98); });
        box(.08, 1.5, .09, 'white', g, j * 1.42 - .64, .88, 1);
      }
      stick(new T.Vector3(2.25, .15, .3), new T.Vector3(2.25, 3.18, .3), .03, 'metal', g);
      box(.8, .51, .03, 'red', g, 2.65, 2.9, .3);
      return 3.45;
    }
    function makeSam(g) {
      cylinder(1.65, 1.85, .19, 'pavement', g, 0, .09, 0, 24);
      cylinder(1.23, 1.3, .15, 'dark', g, 0, .26, 0, 16);
      box(.82, .76, .56, 'robotDark', g, 0, 1.95, 0);
      var torso = cylinder(.67, .39, 1.02, 'robot', g, 0, 2.62, 0, 5); torso.rotation.y = Math.PI / 5;
      box(.18, .46, .06, 'robotGlow', g, 0, 2.7, .57);
      sphere(.31, 'robotDark', g, 0, 3.35, .02, 12);
      var head = cylinder(.29, .35, .53, 'robot', g, 0, 3.55, .02, 5); head.rotation.y = Math.PI / 5;
      box(.43, .1, .05, 'robotGlow', g, 0, 3.6, .32);
      [-1, 1].forEach(function (side) {
        var shoulder = mesh(new T.OctahedronGeometry(.52, 0), 'robot', g, side * .8, 2.88, -.02); shoulder.scale.set(1.1, 1.3, .86);
        stick(new T.Vector3(side * .85, 2.74, .02), new T.Vector3(side * 1.01, 2.07, .1), .16, 'robotDark', g);
        var forearm = box(.35, .68, .39, 'robot', g, side * 1.04, 1.84, .2); forearm.rotation.z = side * .1;
        sphere(.18, 'robotDark', g, side * 1.08, 1.43, .25, 8);
        var hip = box(.42, .58, .53, 'robot', g, side * .4, 1.68, -.01); hip.rotation.z = side * -.11;
        stick(new T.Vector3(side * .31, 1.6, .02), new T.Vector3(side * .48, .81, .08), .18, 'robotDark', g);
        var leg = box(.46, .82, .47, 'robot', g, side * .48, .98, .05); leg.rotation.z = side * -.08;
        box(.18, .43, .49, 'robotGlow', g, side * .49, 1.07, .07);
        box(.57, .29, .88, 'robot', g, side * .5, .49, .26);
        var fin = box(.19, 1.4, .41, 'robot', g, side * .75, 3.14, -.35); fin.rotation.z = side * -.39;
        stick(new T.Vector3(side * .2, 3.75, 0), new T.Vector3(side * .35, 4.17, -.03), .025, 'gold', g);
      });
      return 4.55;
    }
    function makeWaterfront(g) {
      box(2.8, .14, 5.1, 'pavement', g, 0, .07, 0);
      box(1.14, .055, 4.75, 'grass', g, -.67, .17, 0);
      box(.83, .035, 4.95, 'white', g, .72, .16, 0);
      [-1.9, -.65, .65, 1.9].forEach(function (z, i) {
        tree(-.78, z, i % 2 ? .74 : .64, g);
        cylinder(.025, .035, .8, 'metal', g, 1.24, .58, z, 6);
        sphere(.085, 'window', g, 1.24, 1.02, z, 8);
      });
      box(.045, .05, 4.9, 'metal', g, 1.33, .61, 0);
      for (var post = -2.3; post <= 2.3; post += .58) box(.038, .44, .038, 'metal', g, 1.33, .38, post);
      [-1.15, 1.25].forEach(function (z) {
        box(.22, .1, .67, 'cream', g, -.12, .32, z);
        box(.06, .27, .67, 'cream', g, -.26, .42, z);
      });
      cylinder(.72, .77, .11, 'white', g, .51, .22, .1, 24);
      var canopy = sphere(.57, 'metal', g, .5, 1.27, .1, 20); canopy.scale.set(1, .18, 1);
      [-1, 1].forEach(function (side) { cylinder(.035, .035, .99, 'white', g, .5 + side * .37, .74, .1, 8); });
      return 1.65;
    }
    function makeHotel(g) {
      box(3, .14, 2.9, 'pavement', g, 0, .08, 0);
      box(2.5, 3.8, 2.15, 'white', g, 0, 2.06, 0);
      box(2.61, .16, 2.24, 'cream', g, 0, 4.03, 0);
      box(.68, 4.05, 2.17, 'cream', g, -.9, 2.14, 0);
      for (var y = .9; y < 3.8; y += .6) for (var x = -.6; x <= .9; x += .47) box(.26, .34, .03, 'window', g, x, y, 1.095);
      box(.72, .91, .04, 'glassDark', g, .35, .61, 1.11);
      box(1.25, .12, .62, 'gold', g, .35, 1.15, 1.27);
      box(.59, .59, .09, 'gold', g, -.9, 3.18, 1.14);
      return 4.5;
    }
    function makeAirport(g) {
      box(9.4, .12, 6, 'pavement', g, 0, .04, 0);
      box(8.5, .04, 1.13, 'track', g, 0, .12, -1.6);
      for (var i = -4; i <= 4; i++) box(.46, .017, .055, 'white', g, i * .88, .15, -1.6);
      [-3.95, 3.95].forEach(function (x) { for (var j = -2; j <= 2; j++) box(.33, .018, .043, 'white', g, x, .152, -1.6 + j * .14); });
      box(6.3, .92, 1.4, 'white', g, -.2, .58, .77);
      box(6.5, .14, 1.68, 'metal', g, -.2, 1.1, .77);
      box(5.7, .47, .025, 'glass', g, -.2, .66, -.0);
      [-2.25, -.8, .7, 2.15].forEach(function (x) { box(.28, .21, .87, 'white', g, x, .39, -.37); });
      cylinder(.2, .24, 1.8, 'white', g, 3.6, 1.02, .5, 8);
      cylinder(.53, .38, .5, 'glassDark', g, 3.6, 2.1, .5, 8);
      cylinder(.57, .57, .09, 'white', g, 3.6, 2.4, .5, 8);
      var plane = new T.Group(); g.add(plane); plane.position.set(.2, .51, -1.52); plane.rotation.y = .08;
      var body = sphere(.22, 'white', plane, 0, 0, 0, 12); body.scale.set(5.2, .8, .85);
      var wing = new T.Shape(); wing.moveTo(-.35, 0); wing.lineTo(-.55, -1.1); wing.lineTo(.09, -.15); wing.lineTo(.09, .15); wing.lineTo(-.55, 1.1); wing.closePath();
      var wings = mesh(new T.ExtrudeGeometry(wing, { depth: .035, bevelEnabled: false }), 'white', plane, 0, -.025, 0); wings.rotation.x = -Math.PI / 2;
      box(.4, .055, .84, 'white', plane, -.78, .03, 0);
      var tail = box(.28, .36, .06, 'red', plane, -.87, .2, 0); tail.rotation.z = -.28;
      return 2.85;
    }

    /* A small Pearl Tower and a riverboat give the waterfront its own silhouette. */
    var pearl = new T.Group(); world.add(pearl); pearl.position.set(7.5, .04, -14.8);
    cylinder(.2, .34, 6, 'metal', pearl, 0, 3.1, 0, 10);
    [0, 1, 2].forEach(function (i) { var a = i * Math.PI * 2 / 3; stick(new T.Vector3(Math.cos(a) * .9, .15, Math.sin(a) * .9), new T.Vector3(Math.cos(a) * .2, 2.35, Math.sin(a) * .2), .12, 'white', pearl); });
    sphere(.91, 'red', pearl, 0, 2.44, 0, 20); sphere(.55, 'red', pearl, 0, 5.12, 0, 18);
    cylinder(.024, .09, 1.6, 'metal', pearl, 0, 6.69, 0, 8);
    cylinder(.91, .91, .16, 'glassDark', pearl, 0, 2.46, 0, 24);
    cylinder(.56, .56, .12, 'glassDark', pearl, 0, 5.13, 0, 20);
    cylinder(.917, .917, .041, 'window', pearl, 0, 2.38, 0, 24);
    cylinder(.564, .564, .035, 'window', pearl, 0, 5.06, 0, 20);
    var boat = new T.Group(); world.add(boat); boat.position.set(riverX(2), .18, 2); boat.rotation.y = -.15;
    var hull = sphere(.5, 'white', boat, 0, 0, 0, 12); hull.scale.set(.63, .35, 2.1);
    box(.46, .23, 1.18, 'white', boat, 0, .19, -.04); box(.36, .15, .81, 'glassDark', boat, 0, .36, -.15);
    for (var lp = 0; lp < 12; lp++) {
      var lz = -19.8 + lp * 3.5;
      var lx = riverX(lz) - 2.45;
      cylinder(.025, .037, .68, 'metal', world, lx, .36, lz, 6);
      sphere(.085, 'window', world, lx, .73, lz, 8);
    }
    [[12.9, -2.4, 0x57c5c7, 14], [12, 16.5, 0xffb477, 10], [-21, 15, 0x53e6cc, 8], [7.5, -14.8, 0xefb3bc, 9]].forEach(function (light) {
      var glow = new T.PointLight(light[2], 0, light[3], 2);
      glow.position.set(light[0], 4, light[1]); world.add(glow); glowLights.push(glow);
    });

    var labelsLayer = document.createElement('div'); labelsLayer.className = 'scene-labels';
    labelsLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;'; container.appendChild(labelsLayer);
    places.forEach(function (p) {
      if (!p.position || p.position.length < 2) return;
      var pos = point(p), group = new T.Group(); group.position.set(pos.x, .04, pos.z); world.add(group);
      var height;
      if (p.kind === 'tower') height = makeTower(group);
      else if (p.kind === 'museum' || p.kind === 'art' || p.id === 'china') height = makeArt(group);
      else if (p.kind === 'gallery' || p.id === 'map') height = makeGallery(group);
      else if (p.kind === 'campus') height = makeCampus(group);
      else if (p.kind === 'robot' || p.kind === 'sam') height = makeSam(group);
      else if (p.kind === 'waterfront') height = makeWaterfront(group);
      else if (p.kind === 'airport') height = makeAirport(group);
      else if (p.kind === 'hotel') height = makeHotel(group);
      else height = makeHistoric(group, p.id);
      var landmarkScale = p.kind === 'airport' ? 1.08 : p.kind === 'tower' ? 1.1 : 1.16;
      group.scale.setScalar(landmarkScale); height *= landmarkScale;
      group.traverse(function (child) { if (child.isMesh) { child.userData.placeId = p.id; pickMeshes.push(child); } });
      var day = String(p.day || '3'), color = DAY_COLORS[day] || 0x8b7350;
      var ring = mesh(new T.RingGeometry(p.kind === 'airport' ? 4.9 : 2.95, p.kind === 'airport' ? 5.07 : 3.09, 64), new T.MeshBasicMaterial({ color: color, transparent: true, opacity: .0, depthWrite: false, side: T.DoubleSide }), world, pos.x, .17, pos.z);
      ring.rotation.x = -Math.PI / 2; ring.castShadow = false; ring.receiveShadow = false;
      var button = document.createElement('button'); button.className = 'map-label'; button.type = 'button'; button.dataset.place = p.id;
      button.style.position = 'absolute'; button.style.pointerEvents = 'auto'; button.style.whiteSpace = 'nowrap'; button.style.transform = 'translate(-50%, -100%)';
      button.setAttribute('aria-label', '查看' + p.name);
      var dot = document.createElement('span'); dot.className = 'label-dot'; dot.style.backgroundColor = '#' + color.toString(16).padStart(6, '0');
      var title = document.createElement('span'); title.className = 'label-name'; title.textContent = p.short || p.name;
      var leader = document.createElement('span'); leader.className = 'scene-leader';
      leader.style.cssText = 'position:absolute;pointer-events:none;height:1px;transform-origin:0 50%;opacity:.36;background:#456e64;';
      labelsLayer.appendChild(leader);
      button.appendChild(dot); button.appendChild(title); labelsLayer.appendChild(button);
      button.addEventListener('click', function (event) { event.stopPropagation(); select(p.id, false); if (options.onSelect) options.onSelect(p.id); });
      var entry = { place: p, group: group, ring: ring, height: height, button: button, leader: leader, anchor: new T.Vector3(pos.x, height + .5, pos.z), screen: new T.Vector3() };
      labelEntries.push(entry); landmarks[p.id] = entry;
    });

    function makeRoute(day, ids) {
      var group = new T.Group(); routeGroups[day] = group; world.add(group);
      group.userData.ids = ids; group.userData.curves = []; group.userData.segments = [];
      var color = DAY_COLORS[day];
      var mat = new T.MeshBasicMaterial({ color: color, transparent: true, opacity: .88, depthWrite: false });
      for (var i = 1; i < ids.length; i++) {
        var aa = landmarks[ids[i - 1]], bb = landmarks[ids[i]]; if (!aa || !bb) continue;
        var a = aa.group.position.clone(), b = bb.group.position.clone(); a.y = .31; b.y = .31;
        var delta = b.clone().sub(a), midpoint = a.clone().add(b).multiplyScalar(.5);
        var lift = day === '5' ? .45 : .15;
        midpoint.y += lift;
        var bend = new T.Vector3(-delta.z, 0, delta.x).normalize().multiplyScalar(Math.min(delta.length() * .12, 1.7));
        if (i % 2) midpoint.add(bend); else midpoint.sub(bend);
        var curve = new T.QuadraticBezierCurve3(a, midpoint, b);
        var tube = mesh(new T.TubeGeometry(curve, Math.max(12, Math.round(delta.length() * 2)), .085, 6, false), mat.clone(), group); tube.castShadow = false; tube.receiveShadow = false;
        group.userData.curves.push(curve); group.userData.segments.push(tube);
        var arrowPoint = curve.getPoint(.56), direction = curve.getTangent(.56);
        var arrow = mesh(new T.ConeGeometry(.22, .53, 3), new T.MeshBasicMaterial({ color: color }), group); arrow.position.copy(arrowPoint); arrow.position.y += .03;
        arrow.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize()); arrow.castShadow = false;
      }
    }
    days.forEach(function (day) {
      if (Array.isArray(day.route) && day.route.length > 1) makeRoute(String(day.id), day.route.slice());
    });
    var traveler = new T.Group(); world.add(traveler); traveler.visible = false;
    var travelerMaterial = new T.MeshBasicMaterial({ color: 0xdb8a39 });
    var travelerDot = sphere(.28, travelerMaterial, traveler, 0, .58, 0, 16);
    var travelerHalo = mesh(new T.RingGeometry(.46, .57, 32), new T.MeshBasicMaterial({ color: 0xdb8a39, transparent: true, opacity: .9, side: T.DoubleSide }), traveler, 0, .015, 0);
    travelerHalo.rotation.x = -Math.PI / 2; travelerHalo.castShadow = false;

    var raycaster = new T.Raycaster(), pointer = new T.Vector2();
    function updateCamera() {
      var sp = Math.sin(orbit.phi);
      camera.position.set(target.x + orbit.distance * sp * Math.sin(orbit.theta), target.y + orbit.distance * Math.cos(orbit.phi), target.z + orbit.distance * sp * Math.cos(orbit.theta));
      camera.lookAt(target); camera.updateMatrixWorld();
    }
    function updateLabels() {
      var list = [];
      labelEntries.forEach(function (entry) {
        entry.screen.copy(entry.anchor).project(camera);
        var valid = entry.screen.z >= -1 && entry.screen.z <= 1 && Math.abs(entry.screen.x) < 1.3 && Math.abs(entry.screen.y) < 1.3;
        entry.button.style.display = valid ? '' : 'none';
        entry.leader.style.display = valid ? '' : 'none';
        if (!valid) return;
        var half = Math.max(40, entry.button.offsetWidth / 2), labelHeight = Math.max(30, entry.button.offsetHeight);
        var x = (entry.screen.x * .5 + .5) * width, y = (-entry.screen.y * .5 + .5) * height;
        var priority = entry.place.id === activeId ? 3 : activeDay === 'all' || String(entry.place.day) === activeDay || entry.place.id === 'hotel' ? 2 : 1;
        list.push({ entry: entry, ax: x, ay: y, x: x, y: y, half: half, h: labelHeight, priority: priority });
      });
      list.sort(function (a, b) { return b.priority - a.priority || a.ay - b.ay; });
      var placed = [];
      list.forEach(function (item) {
        var best = null, cost = Infinity;
        for (var level = 0; level < 8; level++) {
          var vertical = level === 0 ? 0 : (level % 2 ? -1 : 1) * Math.ceil(level / 2) * (item.h + 8);
          [0, -60, 60, -120, 120].forEach(function (horizontal) {
            var x = T.MathUtils.clamp(item.ax + horizontal, item.half + 13, Math.max(item.half + 13, width - item.half - 70));
            var y = T.MathUtils.clamp(item.ay + vertical, item.h + 62, Math.max(item.h + 62, height - 92));
            var score = Math.pow(x - item.ax, 2) + Math.pow(y - item.ay, 2) * 1.15;
            placed.forEach(function (other) {
              if (Math.abs(x - other.x) < item.half + other.half + 8 && Math.abs((y - item.h / 2) - (other.y - other.h / 2)) < (item.h + other.h) / 2 + 8) score += 100000;
            });
            if (score < cost) { cost = score; best = { x: x, y: y }; }
          });
          if (cost < 1000) break;
        }
        item.x = best.x; item.y = best.y; placed.push(item);
        item.entry.button.style.left = item.x.toFixed(1) + 'px'; item.entry.button.style.top = item.y.toFixed(1) + 'px';
        item.entry.button.style.zIndex = String(item.priority + 2);
        var dx = item.x - item.ax, dy = item.y + 3 - item.ay, length = Math.hypot(dx, dy);
        var leader = item.entry.leader;
        leader.style.display = length > 7 && length < 240 ? '' : 'none';
        leader.style.left = item.ax.toFixed(1) + 'px'; leader.style.top = item.ay.toFixed(1) + 'px';
        leader.style.width = length.toFixed(1) + 'px'; leader.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
        leader.style.backgroundColor = currentTheme === 'night' ? '#afd3c7' : '#497b6a';
        leader.style.opacity = item.priority === 1 ? '.17' : '.43';
      });
    }
    function render(now) {
      frame = 0; if (disposed) return;
      if (transition) {
        var t = Math.min(1, (now - transition.start) / transition.duration), ease = 1 - Math.pow(1 - t, 3);
        orbit.theta = T.MathUtils.lerp(transition.from.theta, transition.to.theta, ease);
        orbit.phi = T.MathUtils.lerp(transition.from.phi, transition.to.phi, ease);
        orbit.distance = T.MathUtils.lerp(transition.from.distance, transition.to.distance, ease);
        target.lerpVectors(transition.fromTarget, transition.toTarget, ease);
        if (t >= 1) transition = null;
      }
      if (journey) {
        var jt = reducedMotion ? 1 : Math.min(1, (now - journey.start) / 1450);
        traveler.position.copy(journey.curve.getPoint(jt));
        traveler.position.y += Math.max(0, (jt - .72) / .28) * journey.endHeight;
        travelerDot.position.y = .58 + Math.sin(jt * Math.PI * 4) * .14;
        travelerHalo.scale.setScalar(1 + Math.sin(jt * Math.PI * 4) * .1);
        if (jt >= 1) journey = null;
      }
      updateCamera(); updateLabels(); renderer.render(scene, camera);
      if (transition || journey) requestRender();
    }
    function requestRender() { if (!frame && !disposed) frame = window.requestAnimationFrame(render); }
    function tween(toOrbit, toTarget) {
      if (reducedMotion) { Object.assign(orbit, toOrbit); target.copy(toTarget || target); transition = null; requestRender(); return; }
      transition = { start: performance.now(), duration: 620, from: Object.assign({}, orbit), to: Object.assign({}, orbit, toOrbit), fromTarget: target.clone(), toTarget: (toTarget || target).clone() }; requestRender();
    }
    function select(id, focus) {
      activeId = landmarks[id] ? id : null;
      labelEntries.forEach(function (entry) {
        var selected = entry.place.id === activeId;
        entry.button.classList.toggle('selected', selected); entry.button.setAttribute('aria-pressed', selected ? 'true' : 'false');
        entry.ring.material.opacity = selected ? .95 : 0;
      });
      if (focus !== false && activeId) {
        var entry = landmarks[activeId], location = entry.group.position.clone();
        location.y = Math.min(entry.height * .12, 1.4);
        tween({ distance: Math.max(52, initial.distance * .68) }, centre.clone().lerp(location, .63));
      }
      requestRender();
    }
    function setDay(day) {
      activeDay = String(day);
      journey = null; traveler.visible = false;
      Object.keys(routeGroups).forEach(function (d) {
        routeGroups[d].visible = activeDay === 'all' || activeDay === d;
        routeGroups[d].userData.segments.forEach(function (segment) { segment.material.opacity = activeDay === 'all' ? .48 : .88; });
      });
      labelEntries.forEach(function (entry) {
        var pday = String(entry.place.day || '0'), relevant = activeDay === 'all' || pday === activeDay || pday === '0';
        entry.button.classList.toggle('dim', !relevant); entry.button.style.opacity = relevant ? '1' : '.43';
      });
      requestRender();
    }
    function setRouteProgress(day, index) {
      var route = routeGroups[String(day)], step = Math.floor(Number(index));
      if (!route || step < 0 || !Number.isFinite(step)) { journey = null; traveler.visible = false; requestRender(); return; }
      if (activeDay !== String(day)) setDay(day);
      step = Math.min(step, route.userData.ids.length - 1);
      var destination = landmarks[route.userData.ids[step]];
      if (!destination) return;
      route.userData.segments.forEach(function (segment, i) { segment.material.opacity = i < step ? 1 : .18; });
      travelerMaterial.color.setHex(DAY_COLORS[String(day)]); travelerHalo.material.color.setHex(DAY_COLORS[String(day)]);
      traveler.visible = true;
      if (step > 0 && route.userData.curves[step - 1]) journey = { start: performance.now(), curve: route.userData.curves[step - 1], endHeight: destination.height };
      else { journey = null; traveler.position.copy(destination.group.position); traveler.position.y = destination.height + .32; }
      select(destination.place.id, true); requestRender();
    }
    function setTheme(theme) {
      currentTheme = theme === 'night' ? 'night' : 'day';
      var night = currentTheme === 'night', palette = palettes[currentTheme];
      Object.keys(materials).forEach(function (name) {
        materials[name].color.setHex(palette[name] || 0xffffff);
        if (name === 'window' || name === 'robotGlow') { materials[name].emissive.setHex(palette[name]); materials[name].emissiveIntensity = night ? 1.55 : .05; }
        if (name === 'glass') { materials[name].emissive.setHex(night ? 0x19546b : 0x000000); materials[name].emissiveIntensity = .48; }
        if (name === 'river') { materials[name].emissive.setHex(night ? 0x16475d : 0x000000); materials[name].emissiveIntensity = .55; }
        if (name === 'red') { materials[name].emissive.setHex(night ? 0x6e2512 : 0x000000); materials[name].emissiveIntensity = .32; }
      });
      scene.background = new T.Color(night ? 0x132735 : 0xf1eddf);
      hemi.color.setHex(night ? 0x9cc8e2 : 0xfff5e0); hemi.groundColor.setHex(night ? 0x233d4a : 0x7b8b7b); hemi.intensity = night ? 1.35 : 2.15;
      sun.color.setHex(night ? 0x93bcdd : 0xffe6bd); sun.intensity = night ? 1.3 : 2.75;
      fill.color.setHex(night ? 0xe8bd7d : 0xbad7dd); fill.intensity = night ? .95 : .78;
      glowLights.forEach(function (glow) { glow.intensity = night ? 24 : 0; });
      renderer.toneMappingExposure = night ? 1.16 : 1.07;
      requestRender();
    }
    function resize() {
      if (disposed) return;
      var bounds = container.getBoundingClientRect(); width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
      var oldDistance = initial.distance;
      initial.distance = Math.max(100, Math.min(180, 128 / camera.aspect));
      if (Math.abs(orbit.distance - oldDistance) < 1 && !transition) orbit.distance = initial.distance;
      requestRender();
    }
    var resizeObserver = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(container); else window.addEventListener('resize', resize);

    var pointerState = new Map(), dragging = false, startPoint = null, gestureMoved = false, pinchDistance = 0;
    function localXY(event) { var b = renderer.domElement.getBoundingClientRect(); return { x: event.clientX - b.left, y: event.clientY - b.top }; }
    function pan(dx, dy) {
      var scale = orbit.distance * .00125;
      target.x += (-dx * Math.cos(orbit.theta) + dy * Math.sin(orbit.theta)) * scale;
      target.z += (dx * Math.sin(orbit.theta) + dy * Math.cos(orbit.theta)) * scale;
      target.x = T.MathUtils.clamp(target.x, -43, 28); target.z = T.MathUtils.clamp(target.z, -27, 30);
    }
    function down(event) {
      if (event.button > 2) return;
      transition = null; dragging = true; gestureMoved = false;
      var pos = localXY(event); pointerState.set(event.pointerId, pos); startPoint = pos;
      renderer.domElement.setPointerCapture(event.pointerId);
      if (pointerState.size === 2) { var points = Array.from(pointerState.values()); pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y); }
      renderer.domElement.style.cursor = 'grabbing';
    }
    function move(event) {
      if (!pointerState.has(event.pointerId)) return;
      var old = pointerState.get(event.pointerId), pos = localXY(event), dx = pos.x - old.x, dy = pos.y - old.y;
      pointerState.set(event.pointerId, pos);
      if (startPoint && Math.hypot(pos.x - startPoint.x, pos.y - startPoint.y) > 4) gestureMoved = true;
      if (pointerState.size > 1) {
        var points = Array.from(pointerState.values()), distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        if (pinchDistance > 0 && distance > 0) orbit.distance = T.MathUtils.clamp(orbit.distance * pinchDistance / distance, 29, 180);
        pinchDistance = distance; pan(dx * .5, dy * .5); gestureMoved = true;
      } else if (event.buttons === 2 || event.shiftKey) pan(dx, dy);
      else { orbit.theta -= dx * .005; orbit.phi = T.MathUtils.clamp(orbit.phi + dy * .004, .10, 1.32); topView = false; }
      requestRender();
    }
    function up(event) {
      var click = pointerState.size === 1 && !gestureMoved && event.type !== 'pointercancel';
      pointerState.delete(event.pointerId); dragging = pointerState.size > 0;
      if (!dragging) renderer.domElement.style.cursor = 'grab';
      if (click) {
        var p = localXY(event); pointer.set(p.x / width * 2 - 1, -(p.y / height) * 2 + 1); raycaster.setFromCamera(pointer, camera);
        var hits = raycaster.intersectObjects(pickMeshes, false);
        if (hits.length) { var id = hits[0].object.userData.placeId; select(id, false); if (options.onSelect) options.onSelect(id); }
      }
    }
    function wheel(event) { event.preventDefault(); transition = null; orbit.distance = T.MathUtils.clamp(orbit.distance * Math.exp(event.deltaY * .00075), 29, 180); requestRender(); }
    function contextmenu(event) { event.preventDefault(); }
    function keydown(event) {
      var handled = true;
      if (event.key === 'ArrowLeft') orbit.theta -= .12;
      else if (event.key === 'ArrowRight') orbit.theta += .12;
      else if (event.key === 'ArrowUp') orbit.phi = Math.max(.1, orbit.phi - .1);
      else if (event.key === 'ArrowDown') orbit.phi = Math.min(1.32, orbit.phi + .1);
      else if (event.key === '+' || event.key === '=') orbit.distance = Math.max(29, orbit.distance / 1.14);
      else if (event.key === '-') orbit.distance = Math.min(180, orbit.distance * 1.14);
      else if (event.key === 'Escape' || event.key === 'Home') { event.preventDefault(); reset(); return; }
      else handled = false;
      if (handled) { transition = null; event.preventDefault(); requestRender(); }
    }
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointerup', up);
    renderer.domElement.addEventListener('pointercancel', up);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', contextmenu);
    renderer.domElement.addEventListener('keydown', keydown);
    function reset() { topView = false; tween(initial, centre); }

    resize(); setTheme('day'); setDay('all'); updateCamera(); renderer.render(scene, camera); updateLabels();
    if (options.onReady) window.requestAnimationFrame(function () { if (!disposed) options.onReady(); });

    return {
      select: function (id) { select(id, true); },
      setDay: setDay,
      setRouteProgress: setRouteProgress,
      setTheme: setTheme,
      reset: reset,
      zoom: function (factor) { factor = Number(factor); if (factor > 0) tween({ distance: T.MathUtils.clamp(orbit.distance / factor, 29, 180) }); },
      rotate: function (delta) { tween({ theta: orbit.theta + (Number(delta) || .2) }); },
      setTopView: function (enabled) { topView = Boolean(enabled); tween({ phi: topView ? .08 : initial.phi, distance: topView ? initial.distance * .9 : initial.distance }, centre); },
      getCanvas: function () { return renderer.domElement; },
      dispose: function () {
        disposed = true; if (frame) cancelAnimationFrame(frame); if (resizeObserver) resizeObserver.disconnect(); else window.removeEventListener('resize', resize);
        renderer.domElement.removeEventListener('pointerdown', down); renderer.domElement.removeEventListener('pointermove', move); renderer.domElement.removeEventListener('pointerup', up); renderer.domElement.removeEventListener('pointercancel', up);
        renderer.domElement.removeEventListener('wheel', wheel); renderer.domElement.removeEventListener('contextmenu', contextmenu); renderer.domElement.removeEventListener('keydown', keydown);
        var geometries = new Set(), mats = new Set(); scene.traverse(function (object) { if (object.geometry) geometries.add(object.geometry); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(function (m) { mats.add(m); }); });
        geometries.forEach(function (g) { g.dispose(); }); mats.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); renderer.dispose(); renderer.domElement.remove(); labelsLayer.remove();
      }
    };
  };
}());
