import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "Ovelia.DynamicDropdownsPro",
    async beforeRegisterNodeDef(nodeType, nodeData, appInstance) {
        if (nodeData.name === "ComfyUI_Dynamic_Dropdowns_Demo") {
            
            // 1. Core initialization when the node is spawned on the canvas
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);
                
                // Set the default size to accommodate the sleek horizontal layout
                this.size = [550, 220];
                
                // Add the dynamic interactive buttons directly onto the node layout
                this.addWidget("button", "➕ Add Slot", null, () => {
                    const dropdownCount = this.widgets.filter(w => w.name.startsWith("custom_slot_")).length;
                    this.addWidget("combo", `custom_slot_${dropdownCount + 1}`, "Select...", () => {}, { values: ["Option A", "Option B"] });
                    this.setSize([550, Math.max(220, 120 + (this.widgets.length * 30))]);
                });

                this.addWidget("button", "➖ Remove Slot", null, () => {
                    const dropdowns = this.widgets.filter(w => w.name.startsWith("custom_slot_"));
                    if (dropdowns.length > 0) {
                        this.removeWidget(dropdowns[dropdowns.length - 1]);
                        this.setSize([550, Math.max(220, 120 + (this.widgets.length * 30))]);
                    }
                });
            };

            // 2. Overriding the foreground draw call to inject custom hardware style & avatar
            nodeType.prototype.onDrawForeground = function (ctx, canvas) {
                // If the node is collapsed, let LiteGraph handle the default minimized render
                if (this.flags.collapsed) return;

                ctx.save();

                // Custom Rounded Card Base & Sleek Cyber Border Glow
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(0, 162, 255, 0.4)"; // Subtle neon blue trim
                ctx.fillStyle = "rgba(30, 34, 42, 0.95)";    // Premium deep dark metallic gray
                
                // Rounding the card profile corners
                ctx.beginPath();
                ctx.roundRect(0, 0, this.size[0], this.size[1], 24);
                ctx.fill();
                ctx.stroke();

                // --- 🎭 DRAW THE AVATAR PORTRAIT FRAMING ---
                const avatarX = 25;
                const avatarY = 40;
                const avatarRadius = 55;

                // Circular outer glow ring matching the concept mockup
                ctx.beginPath();
                ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(0, 255, 150, 0.6)"; // Soft tracking emerald ring
                ctx.lineWidth = 3;
                ctx.stroke();

                // Masking and rendering the placeholder profile artwork circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2);
                ctx.clip();
                
                // Draw a sleek metallic profile backdrop until an asset image is linked
                ctx.fillStyle = "rgba(20, 22, 26, 1)";
                ctx.fillRect(avatarX, avatarY, avatarRadius * 2, avatarRadius * 2);
                
                // Text marker inside avatar ring
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 14px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("0velia", avatarX + avatarRadius, avatarY + avatarRadius + 5);
                ctx.restore();

                // --- 🏷️ PRO LABELS & SLIDER ACCENTS ---
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.font = "bold 16px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText("🎭 Dynamic Dropdowns (Pro Mode)", 160, 30);

                ctx.restore();
            };
        }
    }
});