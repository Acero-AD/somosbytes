// Original studio furniture geometry, dedicated to CC0-1.0.
// Rebuild: node scripts/prepare-studio-furniture.mjs (uses the locked Three.js version).
import { Group, Mesh, MeshStandardMaterial, CylinderGeometry, SphereGeometry, Box3, Vector3, REVISION } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.() }) }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.() }) }
}
const materials = {
  oak: new MeshStandardMaterial({ color: '#c7a981', roughness: 0.55 }),
  metal: new MeshStandardMaterial({ color: '#303333', metalness: 0.65, roughness: 0.38 }),
  fabric: new MeshStandardMaterial({ color: '#424b48', roughness: 0.95 }),
  linen: new MeshStandardMaterial({ color: '#b8aa90', roughness: 1 }),
  rubber: new MeshStandardMaterial({ color: '#202425', roughness: 0.85 }),
}
for (const [name, material] of Object.entries(materials)) material.name = name
let group
function add(geometry, material, position, rotation = [0,0,0]) {
  const mesh = new Mesh(geometry, materials[material])
  mesh.position.set(...position); mesh.rotation.set(...rotation); mesh.updateMatrix()
  geometry.applyMatrix4(mesh.matrix)
  mesh.position.set(0,0,0); mesh.rotation.set(0,0,0)
  group.add(mesh)
}
function box(size, at, material='oak', radius=0.015, rotation) {
  add(new RoundedBoxGeometry(...size, 2, Math.min(radius, ...size.map(x=>x/3))), material, at, rotation)
}
function cylinder(top, bottom, height, at, material='metal', rotation) {
  add(new CylinderGeometry(top,bottom,height,16), material, at, rotation)
}
const builders = {
  desk() {
    box([2.9,0.055,0.75],[0,0.7425,0], 'oak',0.018)
    for(const x of [-1.25,1.25]) {
      for(const z of [-0.27,0.27]) box([0.045,0.715,0.045],[x,0.3575,z],'metal',0.007)
      box([0.045,0.035,0.58],[x,0.04,0],'metal',0.006)
    }
    box([2.52,0.055,0.045],[0,0.66,0.27],'metal',0.006)
    box([0.6,0.075,0.25],[0,0.67,0.13],'metal',0.01)
  },
  officeChair() {
    box([0.52,0.11,0.5],[0,0.45,0],'fabric',0.045)
    box([0.5,0.6,0.1],[0,0.78,0.225],'fabric',0.045,[-0.12,0,0])
    cylinder(0.04,0.045,0.29,[0,0.25,0])
    for(const x of [-0.3,0.3]) {
      box([0.028,0.2,0.035],[x,0.55,0.12],'metal',0.008)
      box([0.075,0.045,0.33],[x,0.655,-0.005],'rubber',0.02)
    }
    for(let i=0;i<5;i++) {
      const a=i*Math.PI*2/5, x=Math.sin(a), z=Math.cos(a)
      box([0.035,0.035,0.3],[x*0.15,0.095,z*0.15],'metal',0.009,[0,a,0])
      cylinder(0.037,0.037,0.055,[x*0.285,0.043,z*0.285],'rubber',[0,0,Math.PI/2])
    }
  },
  coffeeTable() {
    box([1.08,0.045,0.62],[0,0.4375,0],'oak',0.02)
    for(const x of [-0.42,0.42]) for(const z of [-0.21,0.21]) cylinder(0.021,0.015,0.415,[x,0.2075,z])
    box([0.88,0.022,0.44],[0,0.16,0],'oak',0.01)
  },
  sideTable() {
    box([0.57,0.045,0.5],[0,0.7475,0],'oak',0.02)
    for(const x of [-0.22,0.22]) for(const z of [-0.185,0.185]) cylinder(0.018,0.014,0.725,[x,0.3625,z])
  },
  shelf() {
    for(const y of [0.12,0.45,0.78]) box([0.95,0.04,0.38],[0,y,0],'oak',0.01)
    for(const x of [-0.435,0.435]) for(const z of [-0.155,0.155]) box([0.025,0.8,0.025],[x,0.4,z],'metal',0.006)
  },
  cushion() { box([0.45,0.13,0.42],[0,0.075,0],'fabric',0.06) },
  rug() { box([1.65,0.012,1.12],[0,0.006,0],'linen',0.005) },
  coatRack() {
    cylinder(0.2,0.22,0.045,[0,0.0225,0])
    cylinder(0.018,0.025,1.55,[0,0.8,0])
    for(let i=0;i<4;i++) {
      const a=i*Math.PI/2, x=Math.sin(a), z=Math.cos(a)
      box([0.025,0.025,0.25],[x*0.1,1.34+i*0.05,z*0.1],'oak',0.008,[0,a,0])
      add(new SphereGeometry(0.03,12,8),'oak',[x*0.22,1.34+i*0.05,z*0.22])
    }
  },
}
await mkdir('public/models/realistic', { recursive: true })
const records=[]
for(const [name, build] of Object.entries(builders)) {
  group=new Group();build()
  const merged=new Group()
  for(const material of Object.values(materials)) {
    const geometries=group.children.filter(mesh=>mesh.material===material).map(mesh=>mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry)
    if(!geometries.length)continue
    merged.add(new Mesh(mergeGeometries(geometries),material))
  }
  const bounds=new Box3().setFromObject(merged),size=bounds.getSize(new Vector3()).toArray()
  const binary=await new GLTFExporter().parseAsync(merged,{binary:true})
  const data=Buffer.from(binary),path=`public/models/realistic/${name}.glb`
  await writeFile(path,data)
  const triangles=merged.children.reduce((s,m)=>s+m.geometry.getAttribute('position').count/3,0)
  records.push({path,status:'prepared',source:'scripts/prepare-studio-furniture.mjs',author:'Original geometry created for somosbytes',license:'CC0-1.0',licenseEvidence:'Original geometry dedicated to CC0 in the source generator',bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),dimensions:size,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},triangles,materials:merged.children.length,images:[],extensionsRequired:[],recipe:'Run scripts/prepare-studio-furniture.mjs; rounded primitives merged by material; meters/Y-up; ordinary GLB; no decoder',tool:`Three.js r${REVISION}; ${process.version}`,date:'2026-09-10'})
}
const path='docs/room-review/assets.json',inventory=JSON.parse(await readFile(path,'utf8'))
inventory.assets=[...inventory.assets.filter(a=>!records.some(r=>r.path===a.path)),...records]
await writeFile(path,JSON.stringify(inventory,null,2)+'\n')
console.log(records.map(({path,bytes,triangles})=>({path,bytes,triangles})))
