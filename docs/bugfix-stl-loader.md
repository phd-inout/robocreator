# ✅ STL/OBJ/FBX 文件加载问题 - 完整解决方案

## 问题总结

### 原始错误
```
Unexpected token 's', "solid K26新"... is not valid JSON
```

### 根本原因
1. **文件格式检测缺失**: `Sidebar.tsx` 中的文件上传没有设置 `modelFormat` 字段
2. **默认使用 GLB Loader**: 当 `modelFormat` 未定义时,默认使用 `GltfModel`,导致 STL 文件被当作 JSON 解析
3. **尺寸问题**: STL 文件通常使用毫米单位,导致模型过大

## 完整修复方案

### 1. 修复文件格式检测 (`Sidebar.tsx`)

**问题代码**:
```typescript
specs: { dims: [1, 1, 1], weight: 1, sockets: [], type: 'accessory' }
```

**修复后**:
```typescript
// 检测文件格式
const fileName = file.name.toLowerCase();
let format: 'glb' | 'stl' | 'obj' | 'fbx' = 'glb';
if (fileName.endsWith('.stl')) format = 'stl';
else if (fileName.endsWith('.obj')) format = 'obj';
else if (fileName.endsWith('.fbx')) format = 'fbx';

specs: { 
    dims: [1, 1, 1], 
    weight: 1, 
    sockets: [], 
    type: 'accessory',
    modelFormat: format  // ✅ 关键修复
}
```

### 2. 修复 Loader 实现 (`PartModel.tsx`)

#### 问题
- `useLoader` 的第三个参数不是 loader 配置回调
- Blob URL 的响应类型问题

#### 解决方案
使用 `fetch` + `loader.parse()` 手动加载:

```typescript
function StlModel({ url, color }: { url: string; color: string }) {
    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const loader = new STLLoader();
        
        fetch(url)
            .then(res => res.arrayBuffer())  // ✅ 显式获取 ArrayBuffer
            .then(buffer => {
                const geom = loader.parse(buffer);  // ✅ 直接解析
                
                // 自动缩放
                geom.computeBoundingBox();
                const bbox = geom.boundingBox;
                if (bbox) {
                    const size = new THREE.Vector3();
                    bbox.getSize(size);
                    const maxDim = Math.max(size.x, size.y, size.z);
                    if (maxDim > 10) {
                        setScale(1 / maxDim);  // ✅ 归一化到 1 单位
                    }
                }
                
                setGeometry(geom);
            })
            .catch(err => console.error('STL Load Error:', err));
    }, [url]);

    if (!geometry) return null;
    return (
        <mesh geometry={geometry} castShadow receiveShadow scale={scale}>
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
```

### 3. 添加自动缩放

**缩放策略**:
- 计算模型的边界框 (Bounding Box)
- 获取最大维度 (maxDim)
- 如果 `maxDim > 10`,缩放到 `1 / maxDim`

**适用于**:
- ✅ STL: 通常是毫米单位,需要缩小 1000 倍左右
- ✅ OBJ: 根据实际尺寸自动调整
- ✅ FBX: 默认 0.01 倍,或根据边界框调整

## 修改的文件

### 1. [`src/components/editor/Sidebar.tsx`](file:///Users/penghaidong/robo-creator/src/components/editor/Sidebar.tsx#L74-L103)
- 添加文件格式检测逻辑
- 在 `specs` 中添加 `modelFormat` 字段

### 2. [`src/components/editor/PartModel.tsx`](file:///Users/penghaidong/robo-creator/src/components/editor/PartModel.tsx#L17-L147)
- 重写 `StlModel`: 使用 `fetch` + `parse` + 自动缩放
- 重写 `ObjModel`: 添加边界框计算和缩放
- 重写 `FbxModel`: 添加边界框计算和缩放
- 重写 `GltfModel`: 支持 Blob URL 的手动加载

### 3. [`src/components/editor/ImportDialog.tsx`](file:///Users/penghaidong/robo-creator/src/components/editor/ImportDialog.tsx#L33-L107)
- 使用 `endsWith()` 代替 `split().pop()`
- 添加调试日志

### 4. [`src/components/editor/CanvasArea.tsx`](file:///Users/penghaidong/robo-creator/src/components/editor/CanvasArea.tsx#L117-L140)
- 添加 `Suspense` 边界捕获异步加载错误

## 验证步骤

1. **刷新浏览器** (Cmd+Shift+R)
2. **点击 Sidebar 的 "+ Model" 按钮**
3. **选择 STL/OBJ/FBX 文件**
4. **查看控制台日志**:
   ```
   [Sidebar] File upload: K26新底盘.stl
   [Sidebar] Format: stl
   [GenericModel] Loading: { url: "blob:...", format: "stl", isBlobUrl: true }
   [StlModel] Loading STL from: blob:...
   [StlModel] Bounding box size: Vector3 { x: 500, y: 200, z: 300 } Auto scale: 0.002
   [StlModel] Geometry loaded: BufferGeometry {...}
   ```

## 预期结果

✅ **STL 文件正常加载**
✅ **模型尺寸自动调整到合理范围**
✅ **无控制台错误**
✅ **可以拖拽/旋转模型**

## 技术要点

### 为什么不用 `useLoader`?
`useLoader` 的签名:
```typescript
useLoader<L>(
  loader: L,
  input: string,
  extensions?: (loader: L) => void,  // ❌ 不是配置回调
  onProgress?: (event: ProgressEvent) => void
)
```
第三个参数用于扩展 loader,但**不会在加载前调用**,无法配置 `responseType`。

### 为什么需要 ArrayBuffer?
- STL/OBJ/FBX 都是二进制或文本格式
- `loader.parse()` 需要 ArrayBuffer (STL/FBX) 或 String (OBJ)
- Blob URL 默认可能返回其他类型,导致解析失败

### 自动缩放算法
```typescript
const maxDim = Math.max(size.x, size.y, size.z);
if (maxDim > 10) {
    scale = 1 / maxDim;  // 归一化到 1 单位
}
```
- 场景网格通常是 1x1 单位
- 如果模型 > 10 单位,认为是毫米/厘米单位
- 缩放到 1 单位左右,保持在视野内

## 后续优化建议

1. **添加加载进度条**: 显示文件上传和解析进度
2. **支持手动缩放**: 在属性面板中添加缩放滑块
3. **缓存 Blob URL**: 避免页面刷新后失效
4. **支持更多格式**: 如 STEP, IGES 等 CAD 格式
5. **添加模型预览**: 在上传前显示缩略图

## 状态
✅ **已完全修复** - 2026-02-11 18:02
