import { GetSettings } from "../../wailsjs/go/settings/Settings";
const getSettings = async () => {
    const settings = await GetSettings();
    return settings;
};
export default () => {
    return {
        getSettings,
    };
};
