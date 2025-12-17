sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ViewSettingsDialog",
    "sap/m/ViewSettingsItem"
], function (Controller, History, Filter, FilterOperator, Sorter, ViewSettingsDialog, ViewSettingsItem) {
    "use strict";

    return Controller.extend("ehsm.controller.Incident", {
        onInit: function () {
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

        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilters.push(new Filter([
                    new Filter("Title", FilterOperator.Contains, sQuery),
                    new Filter("IncidentID", FilterOperator.Contains, sQuery)
                ], false)); // OR condition
            }

            var oTable = this.byId("idIncidentTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onSort: function () {
            if (!this._oSortDialog) {
                this._oSortDialog = new ViewSettingsDialog({
                    confirm: function (oEvent) {
                        var oTable = this.byId("idIncidentTable");
                        var oBinding = oTable.getBinding("items");
                        var mParams = oEvent.getParameters();
                        var sPath = mParams.sortItem.getKey();
                        var bDescending = mParams.sortDescending;
                        oBinding.sort(new Sorter(sPath, bDescending));
                    }.bind(this),
                    sortItems: [
                        new ViewSettingsItem({ text: "Date", key: "CreatedOn", selected: true }),
                        new ViewSettingsItem({ text: "Status", key: "IncidentRecordStatus" }),
                        new ViewSettingsItem({ text: "Plant", key: "PlantID" })
                    ]
                });
                this.getView().addDependent(this._oSortDialog);
            }
            this._oSortDialog.open();
        }
    });
});
