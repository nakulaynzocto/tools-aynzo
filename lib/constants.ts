export const WHATSAPP_NUMBER = "917818073306"; // REPLACE THIS WITH YOUR REAL NUMBER

export const getWhatsAppLink = (rate: string) => {
    const message = `Hi Aynzo Team! I'm interested in the ${rate} website development offer. Can we discuss my project?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
