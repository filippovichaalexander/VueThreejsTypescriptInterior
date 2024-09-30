declare module "three-csg" {
  export class CSG {
    static fromMesh(mesh: THREE.Mesh): any; // Replace 'any' with the specific type if known
    static toMesh(csg: any, material?: THREE.Material): THREE.Mesh;
    // Add other methods as necessary
  }
}
