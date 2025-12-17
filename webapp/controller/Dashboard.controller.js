sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onPressIncident: function () {
            this.getOwnerComponent().getRouter().navTo("RouteIncident");
        },

        onPressRisk: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRisk");
        },

        onLogout: function () {
            // Clear session
            var oSession = this.getOwnerComponent().getModel("session");
            if (oSession) {
                oSession.setData({});
            }
            MessageToast.show("Logged out");
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
    });
});
