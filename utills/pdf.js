//const fs = require("fs");
const pdf_document = require("pdfkit-table");

exports.pdfExport = async (data, business_name, dataCallback, endCallback) => {
    // init document
    const doc = new pdf_document({ margin: 30, size: "A4" });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    // doc.moveDown();
    const table = {
        title: " Business History ",
        subtitle:
            `${business_name}` +
            `\n` +
            `Generated ON: ${new Date().toUTCString()}`,
        headers: [
            { label: "Date", property: "updatedAt", width: 100 },
            { label: "Description", property: "description", width: 250 },

            { label: "UpdatedBy", property: "updatedBy", width: 200 },
        ],
        datas: data,
    };
    await doc.table(table, {
        width: 500,
    });

    //finalize document
    doc.end();
};
