import { GetSettings } from "../../wailsjs/go/main/Settings";
const getSettings = async () => {
    const settings = await GetSettings();
    return settings;
};
export default () => {
    return {
        getSettings,
    };
};
