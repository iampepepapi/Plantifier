import DHTMoistureViewer from "@/components/DHTMoistureViewer";
import React from "react";

function Home() {
    return (
        <div className="m-auto flex justify-center p-4 md:p-0 ">
            <DHTMoistureViewer />
        </div>
    );
}

export default Home;