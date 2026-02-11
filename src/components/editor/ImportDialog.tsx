"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDesignStore } from "@/store/useDesignStore";

interface ImportDialogProps {
    file: File | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportDialog({ file, isOpen, onClose }: ImportDialogProps) {
    const { addPart } = useDesignStore();

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("ACCESSORY");
    const [weight, setWeight] = useState("1.0");
    const [price, setPrice] = useState("0");

    useEffect(() => {
        if (file) {
            const name = file.name.replace(/\.(glb|gltf|stl|obj|fbx)$/i, "");
            setTitle(name);
        }
    }, [file]);

    const handleImport = () => {
        if (!file) return;

        console.log('[ImportDialog] File info:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        const url = URL.createObjectURL(file);
        const w = parseFloat(weight) || 1.0;
        const p = parseFloat(price) || 0;

        // 更健壮的扩展名检测
        const fileName = file.name.toLowerCase();
        let format = 'glb'; // 默认值

        if (fileName.endsWith('.stl')) {
            format = 'stl';
        } else if (fileName.endsWith('.obj')) {
            format = 'obj';
        } else if (fileName.endsWith('.fbx')) {
            format = 'fbx';
        } else if (fileName.endsWith('.gltf') || fileName.endsWith('.glb')) {
            format = 'glb';
        }

        console.log('[ImportDialog] Detected format:', format);

        let specs: any = {
            dims: [1, 1, 1], // Default size, editable later
            weight: w,
            sockets: [],
            modelFormat: format,
        };

        // Smart defaults based on category type
        switch (category) {
            case 'CHASSIS':
                specs = { ...specs, type: 'chassis', max_payload: 50, max_speed: 1.5, climb_angle: 15 };
                break;
            case 'BATTERY':
                specs = { ...specs, type: 'battery', capacity: 1000, voltage: 24, max_output: 500 };
                break;
            case 'SENSOR':
                specs = { ...specs, type: 'sensor', power: 5, range: 10 };
                break;
            case 'ACTUATOR':
                specs = { ...specs, type: 'actuator', power: 20, max_force: 100 };
                break;
            case 'COMPUTE':
                specs = { ...specs, type: 'compute', power: 15, tops: 10 };
                break;
            default:
                specs = { ...specs, type: 'accessory' };
        }

        console.log('[ImportDialog] Final specs:', specs);

        addPart({
            id: `custom-${Date.now()}`,
            skuId: "CUSTOM_UPLOAD",
            name: { zh: title, en: title },
            category,
            position: { x: 0, y: 0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            specs,
            modelRef: url,
            price: p,
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configure Component</DialogTitle>
                    <DialogDescription>
                        Set properties for the imported model.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CHASSIS">Chassis</SelectItem>
                                <SelectItem value="SENSOR">Sensor</SelectItem>
                                <SelectItem value="BATTERY">Battery</SelectItem>
                                <SelectItem value="ACTUATOR">Actuator</SelectItem>
                                <SelectItem value="COMPUTE">Compute</SelectItem>
                                <SelectItem value="ACCESSORY">Accessory</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weight" className="text-right">
                            Weight (kg)
                        </Label>
                        <Input
                            id="weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (¥)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleImport}>Import</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
