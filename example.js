var snowden = require('snowden');
var patches = require('./index');
var normals = require('normals');

var cells = snowden.cells
var positions = snowden.positions

console.time('split to patches');
var manifolds = patches(cells);
console.timeEnd('split to patches');

var regl = require('regl')()
var mat4 = require('gl-mat4')
var wire = require('gl-wireframe')
var camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  theta: Math.PI / 2,
  distance: 4
})

var drawWires = regl({
  vert: `
  precision mediump float;
  attribute vec3 position, normal;
  varying vec3 vNorm;
  uniform mat4 projection;
  uniform mat4 view;
  void main() {
    vNorm = normal;
    gl_Position = projection * view * vec4(position, 1.0);
  }
  `, frag: `
  precision mediump float;
  varying vec3 vNorm;
  void main() {
    vec3 lightDir = normalize(vec3(1., 1., 0.));
    gl_FragColor = vec4(vec3(0.6) + dot(vNorm, lightDir), 1.0);
  }
  `,
  attributes: {
    position: positions,
    normal: normals.vertexNormals(cells, positions)
  },
  elements: wire(cells),
  primitive: 'lines'
})

var drawOuter = regl({
  vert: `
  precision mediump float;
  attribute vec3 position;
  varying vec3 vNorm, vColor;
  uniform vec3 color;
  uniform mat4 projection;
  uniform mat4 view;
  void main() {
    vColor = color;
    gl_Position = projection * view * vec4(position, 1.0);
  }
  `
  , frag: `
  precision mediump float;
  varying vec3 vNorm, vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
  `,
  attributes: {
    position: regl.prop('positions')
  },
  uniforms: {
    color: regl.prop('color')
  },
  elements: regl.prop('elements'),
  primitive: 'triangles'
})

const patchProps = manifolds.map(function(manifold) {
  return {
    view: mat4.create(),
    positions: positions,
    elements: manifold,
    color: [Math.random(), Math.random(), Math.random()]
  }
})

regl.frame(() => {
  regl.clear({
    color: [1, 1, 1, 1],
    depth: 1
  });
  camera(() => {
    drawWires({
      view: mat4.create()
    })

    drawOuter(patchProps)
  })
})
