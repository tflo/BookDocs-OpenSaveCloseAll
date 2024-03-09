// Sources, other variants, helpful articles:
// https://creativepro.com/add-missing-options-to-the-book-menu/
// https://www.hilfdirselbst.ch/gforum/gforum.cgi?post=555008#555008
// https://indesign.hilfdirselbst.ch/2017/01/alle-dateien-im-indesign-buch-offnen.html
// https://www.indiscripts.com/post/2010/02/how-to-create-your-own-indesign-menus

// This script: Thomas Floeren, 2024
// All credits to the original author(s)

#targetengine "BookDocs-OpenSaveCloseAll"

// Core func for closing/saving all

function SaveOrCloseBookDocs(close, saveoption) {
	var docs = app.documents;
	var bookDocs = app.activeBook.bookContents;
	for (var d = docs.length -1; d >= 0; d--) {
		if (!docs[d].saved) continue;
		var docFullName = docs[d].fullName.toString();
		for (var b = bookDocs.length -1; b >= 0 ; b-- ) {
			if (docFullName == bookDocs[b].fullName.toString()) {
				if (close) {
					docs[d].close(SaveOptions[saveoption]);
				} else {
					docs[d].save();
				}
				break;
			}
		}
	}
}

// Handlers for 5 menu items

var fcaTitle1 = "Open All Book Documents";
var fcaHandlers1 = {
	'beforeDisplay' : function(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
	},

	'onInvoke' : function() {
		var showingWindow = !ScriptUI.environment.keyboardState.shiftKey;
		var silence = ScriptUI.environment.keyboardState.altKey;
		var prevPrefs = app.scriptPreferences.userInteractionLevel;

		if (silence) {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
		}

		for (var i = app.activeBook.bookContents.length -1; i >= 0; i--) {
			app.open (app.activeBook.bookContents[i].fullName, showingWindow);
		}
		app.scriptPreferences.userInteractionLevel = prevPrefs;
	}
};

var fcaTitle2 = "Close All Book Documents";
var fcaHandlers2 = {
	'beforeDisplay' : function(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
	},

	'onInvoke' : function() {
		SaveOrCloseBookDocs(true, "ASK");
	}
};

var fcaTitle3 = "Save All Book Documents\u2026";
var fcaHandlers3 = {
	'beforeDisplay' : function(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
	},

	'onInvoke' : function() {
		var myDialog = app.dialogs.add({ name: "Save all Book Documents" });
		with (myDialog.dialogColumns.add()) {
			staticTexts.add({ staticLabel: "Save all documents of '" + app.activeBook.name + "'?" });
		}
		var myResult = myDialog.show();
		if (myResult) {
			SaveOrCloseBookDocs();
		}
		myDialog.destroy();
	}
};

var fcaTitle4 = "Save and Close All Book Documents\u2026";
var fcaHandlers4 = {
	'beforeDisplay' : function(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
	},

	'onInvoke' : function() {
		var myDialog = app.dialogs.add({ name: "Save and Close all Book Documents" });
		with (myDialog.dialogColumns.add()) {
			staticTexts.add({ staticLabel: "Save and close all documents of '" + app.activeBook.name + "'?" });
		}
		var myResult = myDialog.show();
		if (myResult) {
			SaveOrCloseBookDocs(true, "YES");
		}
		myDialog.destroy();
	}
};

var fcaTitle5 = "Close All Book Documents w/o Saving\u2026";
var fcaHandlers5 = {
	'beforeDisplay' : function(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
	},

	'onInvoke' : function() {
		var myDialog = app.dialogs.add({ name: "Close all Book Documents without Saving!" });
		with (myDialog.dialogColumns.add()) {
			staticTexts.add({ staticLabel: "Close all documents of '" + app.activeBook.name + "' without saving?" });
		}
		var myResult = myDialog.show();
		if (myResult) {
			SaveOrCloseBookDocs(true, "NO");
		}
		myDialog.destroy();
	}
};

// Add the menu items

var fcaMenuInstaller = fcaMenuInstaller ||
(function(items) {
	var allIt;
	for (allIt = 0; allIt < items.length; allIt++) {
		// 1. Create the script menu action
		var mnuAction = app.scriptMenuActions.add(items[allIt].title);
		// 2. Attach the event listener
		var ev;
		for (ev in items[allIt].handler) {
			mnuAction.eventListeners.add(ev,items[allIt].handler[ev]);
		}
		// 3. Create the menu items
		var mainMenu = app.menus.item("$ID/BookPanelPopup"); // Works also: "$ID/Book Panel Menu"
		var refItem = mainMenu.menuItems.item("$ID/Close Book");
		mainMenu.menuItems.add(mnuAction,LocationOptions.BEFORE, refItem);
	}
	return true;
})([{title:fcaTitle1, handler:fcaHandlers1}, {title:fcaTitle2, handler:fcaHandlers2}, {title:fcaTitle3, handler:fcaHandlers3}, {title:fcaTitle4, handler:fcaHandlers4}, {title:fcaTitle5, handler:fcaHandlers5}]);

