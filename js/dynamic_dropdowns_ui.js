import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Ovelia.DynamicDropdownsPro",
    async beforeRegisterNodeDef(nodeType, nodeData, appInstance) {
        if (nodeData.name === "ComfyUI_Dynamic_Dropdowns_Demo") {
            
            // 1. Intercept the node instantiation routine
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);
                
                // Initialize premium wide panel sizing
                this.size = [550, 320];
                
                // Fine-tune the default LiteGraph title location to sit neatly in the header
                this.title_offset_y = 22;

                // Add flat interactive UI button for adding new selection slots
                this.addWidget("button", "➕ Add Slot", null, () => {
                    const dropdownCount = this.widgets.filter(w => w.name.startsWith("custom_slot_")).length;
                    
                    // Spawn new dynamic selector widget
                    this.addWidget("combo", `custom_slot_${dropdownCount + 1}`, "Select...", () => {}, { 
                        values: ["Select...", "Cinematic", "Close-up Portrait", "Cyberpunk Neon", "Raw Grain"] 
                    });
                    
                    // Dynamically push the node height down so new slots don't bleed over the edge
                    this.setSize([550, Math.max(320, 160 + (this.widgets.length * 35))]);
                });

                // Add flat interactive UI button for deleting the last slot
                this.addWidget("button", "➖ Remove Slot", null, () => {
                    const dropdowns = this.widgets.filter(w => w.name.startsWith("custom_slot_"));
                    if (dropdowns.length > 0) {
                        this.removeWidget(dropdowns[dropdowns.length - 1]);
                        // Shrink canvas frame bounding box safely back up
                        this.setSize([550, Math.max(320, 160 + (this.widgets.length * 35))]);
                    }
                });
            };

            // 2. Custom background layout painting loop
            nodeType.prototype.onDrawBackground = function (ctx, canvas) {
                if (this.flags.collapsed) return;

                ctx.save();

                // --- PREMIUM CUSTOM CONTAINER METALLIC SHAPE ---
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(0, 195, 255, 0.4)"; // Soft custom neon edge tint
                ctx.fillStyle = "rgba(20, 24, 30, 0.98)";     // Super deep dark satin premium background
                
                ctx.beginPath();
                ctx.roundRect(0, 0, this.size[0], this.size[1], 16);
                ctx.fill();
                ctx.stroke();

                // --- INTEGRATED GRAPHICS SECTION ACCENTS (The Sidebar Panel) ---
                // Fills out the left side area with a beautiful dark abstract geometry block
                ctx.fillStyle = "rgba(12, 14, 18, 0.6)";
                ctx.beginPath();
                ctx.roundRect(10, 50, 120, this.size[1] - 65, 12);
                ctx.fill();

                // --- INNER LAYOUT LINE TABS ---
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(145, 50);
                ctx.lineTo(this.size[0] - 15, 50);
                ctx.stroke();

                ctx.restore();
            };
        }
    }
});
