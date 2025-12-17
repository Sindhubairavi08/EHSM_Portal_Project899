sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onPressRisk: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRisk");
        },

        onPressIncident: function () {
            this.getOwnerComponent().getRouter().navTo("RouteIncident");
        },

        onLogout: function () {
            // Clear session model
            var oSession = this.getOwnerComponent().getModel("session");
            if (oSession) {
                oSession.setData({});
            }
            MessageToast.show("Logged out successfully");
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
    });
});
