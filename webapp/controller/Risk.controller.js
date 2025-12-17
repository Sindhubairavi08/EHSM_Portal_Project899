sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.Risk", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteRisk").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oSession = this.getOwnerComponent().getModel("session");
            var sEmpId = oSession ? oSession.getProperty("/EmployeeId") : null;

            var aFilters = [];
            // Assuming we filter by CreatedBy which matches EmployeeId as per common pattern, 
            // or if there is an explicit EmployeeID field. 
            // The prompt asks to filter using EmployeeId. 
            if (sEmpId) {
                // Using CreatedBy as it is a visible column and likely corresponds to the user's ID
                // You can change this to "EmployeeID" if the OData service uses that field name.
                aFilters.push(new Filter("CreatedBy", FilterOperator.EQ, sEmpId));
            }

            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteDashboard", {}, true);
            }
        },

        onFilterRisks: function (oEvent) {
            var aFilter = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilter.push(new Filter("RiskDescription", FilterOperator.Contains, sQuery));
            }

            var oSession = this.getOwnerComponent().getModel("session");
            var sEmpId = oSession ? oSession.getProperty("/EmployeeId") : null;
            if (sEmpId) {
                aFilter.push(new Filter("CreatedBy", FilterOperator.EQ, sEmpId));
            }

            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilter);
            }
        }
    });
});
