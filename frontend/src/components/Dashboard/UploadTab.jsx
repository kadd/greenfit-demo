import React, { useState } from "react";
import UploadEditor from "@/components/ui/uploads/UploadEditor";

export default function UploadTab({ onUpload }) {

    return (
        <div>
            <h2 className="text-lg font-semibold">Datei-Upload</h2>
            <UploadEditor onUpload={onUpload} />
        </div>
    );
}