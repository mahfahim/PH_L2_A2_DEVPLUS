import app from "./app";
import config from "./config";
import { myDB } from "./db";

const main = () => {
    myDB();
    app.listen(config.port, () => {
        console.log(`DEVPLUS app listening port ${config.port}`);
    });
};

main();