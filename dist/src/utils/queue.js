"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToQueue = publishToQueue;
async function publishToQueue(queueName, payload) {
    // Simulasi pemrosesan gambar delay
    setTimeout(() => {
        console.log(`📨 [QUEUE] Sent to "${queueName}":`, payload);
        console.log(`🖼️ [PROCESSING] Image "${payload.image}" processed.`);
    }, 2000); // Delay seolah-olah sedang proses resize/compress/etc
}
