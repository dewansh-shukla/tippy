import { ConsoleKit } from "brahma-console-kit";


const apiKey = process.env.CONSOLE_API_KEY;
const baseURL = process.env.CONSOLE_BASE_URL;


const consoleKit = new ConsoleKit(apiKey as string, baseURL as string);

export default consoleKit;