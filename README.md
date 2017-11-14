# manifold-patches

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Depth-first traversal of manifoldly-connected components of a 2D simplicial complex.

## Usage

[![NPM](https://nodei.co/npm/manifold-patches.png)](https://www.npmjs.com/package/manifold-patches)

```javascript
var bunny   = require('bunny')
var patches = require('manifold-patches')(cells);
```

`require("manifold-patches")(cells)`
----------------------------------------------------
Splits complex into components connected by the relation that two cells are neighbors iff they share a manifold edge.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/ataber/manifold-patches/blob/master/LICENSE.md) for details.
