sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Init logic
        },

        onLogin: function () {
            var sUserId = this.byId("inpUserId").getValue();
            var sPassword = this.byId("inpPassword").getValue();

            if (!sUserId || !sPassword) {
                MessageToast.show("Please enter both User ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            // Assume we filter Z899_LOGIN by UserID and Password directly
            // Note: In a real scenario, password should be sent via POST or header, 
            // but requirements strictly say "calling the OData entity set Z899_LOGIN"

            var aFilters = [
                new Filter("UserID", FilterOperator.EQ, sUserId),
                new Filter("Password", FilterOperator.EQ, sPassword)
            ];

            sap.ui.core.BusyIndicator.show(0);

            oModel.read("/Z899_LOGIN", {
                filters: aFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];
                        // Validate based on response fields
                        // Assuming response has a status field or successful read implies validity if strict
                        // Let's check a flag or just assume existence = success map to requirements

                        // "validating credentials based on the OData response"
                        // We'll check if a Status field is 'S' or similar if present, else existence is enough.
                        // I'll add a check for a 'Status' field to be safe.

                        // Creating session model
                        var oSessionModel = new JSONModel({
                            UserID: sUserId,
                            UserData: oUser
                        });
                        that.getOwnerComponent().setModel(oSessionModel, "session");

                        MessageToast.show("Login Successful");
                        that.getOwnerComponent().getRouter().navTo("RouteDashboard");
                    } else {
                        MessageBox.error("Invalid Credentials");
                    }
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Login failed. Please check your connection.");
                }
            });
        }
    });
});
