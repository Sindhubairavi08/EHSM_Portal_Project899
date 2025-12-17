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
            // clear inputs if needed
        },

        onLogin: function () {
            var sEmployeeId = this.byId("inpEmployeeId").getValue();
            var sPassword = this.byId("inpPassword").getValue();

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var aFilters = [
                new Filter("EmployeeID", FilterOperator.EQ, sEmployeeId),
                new Filter("Password", FilterOperator.EQ, sPassword)
            ];

            sap.ui.core.BusyIndicator.show(0);

            oModel.read("/Z899_LOGIN", {
                filters: aFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    // Assuming oData.results contains the matched record
                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];
                        // Validate Status
                        if (oUser.Status === "Success" || oUser.Status === "S") {
                            MessageToast.show(oUser.Message || "Login Successful");
                            
                            // Store session
                            var oSessionModel = new JSONModel({
                                EmployeeId: sEmployeeId,
                                UserData: oUser
                            });
                            this.getOwnerComponent().setModel(oSessionModel, "session");
                            
                            // Navigate to Dashboard
                            this.getOwnerComponent().getRouter().navTo("RouteDashboard");
                        } else {
                            MessageBox.error(oUser.Message || "Login Failed: Invalid Credentials");
                        }
                    } else {
                        MessageBox.error("Login Failed: No response from server");
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    try {
                        var oErr = JSON.parse(oError.responseText);
                        MessageBox.error(oErr.error.message.value);
                    } catch (e) {
                        MessageBox.error("Service execution failed.");
                    }
                }
            });
        }
    });
});
