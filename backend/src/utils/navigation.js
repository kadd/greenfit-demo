const fs = require("fs");
const path = require("path");

const navigationFile = path.join(__dirname, "../data/navigation.json");

function loadNavigation() {
    try {
        if (fs.existsSync(navigationFile)) {
            const data = fs.readFileSync(navigationFile, "utf8");
            return JSON.parse(data);
        } else {
            console.warn("Navigation file not found");
            return getDefaultNavigation();
        }
    } catch (error) {
        console.error("Error loading navigation:", error);
        return getDefaultNavigation();
    }
}

function saveNavigation(navigationData) {
    try {
        const dataString = JSON.stringify(navigationData, null, 2);
        fs.writeFileSync(navigationFile, dataString);
        console.log("Navigation saved successfully");
        return true;
    } catch (error) {
        console.error("Error saving navigation:", error);
        throw error;
    }
}

function getDefaultNavigation() {
    return {
        categories: [
            {
                id: "primary",
                label: "Hauptmenü",
                displayIn: ["header", "mobile"],
                items: {
                    home: {
                        id: "home",
                        label: "Home",
                        href: "/",
                        isActive: true,
                        icon: "home"
                    },
                    contact: {
                        id: "contact",
                        label: "Kontakt",
                        href: "/contact",
                        isActive: true,
                        icon: "contact"
                    }
                }
            }
        ],
        settings: {
            showIcons: true,
            layout: "horizontal",
            mobileBreakpoint: 768,
            maxDepth: 2,
            collapsible: true
        }
    };
}

module.exports = {
    loadNavigation,
    saveNavigation,
    getDefaultNavigation
};