# Package Installation for 3D Model Support

Run the following command to install the necessary packages for 3D model support:

```bash
npm install three @react-three/fiber @react-three/drei
```

These packages provide:
- three: The core 3D library
- @react-three/fiber: React renderer for Three.js
- @react-three/drei: Useful helpers for React Three Fiber

## Troubleshooting

If you encounter errors like "Cannot read properties of undefined (reading 'S')", try the following:

1. Make sure you have installed all the packages correctly
2. Check that your GLB file is valid and accessible
3. Try using a specific version of Three.js that is compatible with React Three Fiber:

```bash
npm install three@0.150.1 @react-three/fiber@8.13.0 @react-three/drei@9.77.0
```

Using specific compatible versions can often resolve integration issues between these libraries.
