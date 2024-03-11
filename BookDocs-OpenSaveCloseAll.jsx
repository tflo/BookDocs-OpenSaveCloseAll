/*
BookDocs-OpenSaveCloseAll

A script for Adobe InDesign that adds menu items to the book panel menu for opening/saving/closing *all* documents of the active book. This is a startup script (place it in the Startup Scripts folder inside your user scripts folder).

See the readme for more info.

Sources, other variants, helpful articles:
https://creativepro.com/add-missing-options-to-the-book-menu/
https://www.hilfdirselbst.ch/gforum/gforum.cgi?post=555008#555008
https://indesign.hilfdirselbst.ch/2017/01/alle-dateien-im-indesign-buch-offnen.html
https://www.indiscripts.com/post/2010/02/how-to-create-your-own-indesign-menus

This script: Tom Floeren, 2024
All credits to the original author(s).
 */

#targetengine 'BookDocs-OpenSaveCloseAll'

// Functions

// Core func for closing/saving all
function SaveOrCloseBookDocs(close, saveoption) {
	var docs = app.documents;
	var bookDocs = app.activeBook.bookContents;
	for (var d = docs.length -1; d >= 0; d--) {
		if (!docs[d].saved) continue;
		var docFullName = docs[d].fullName.toString();
		for (var b = bookDocs.length -1; b >= 0 ; b--) {
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

// Test if we have a book with documents
function canRun(ev) {
		ev.target.enabled = (app.books.length > 0 && app.activeBook.bookContents.length > 0);
}

// The confirmation prompt
function confPrompt(title, msg) {
	var prompt = app.dialogs.add({ name: title });
	prompt.dialogColumns.add().staticTexts.add({ staticLabel: msg });
	var result = prompt.show();
	prompt.destroy();
	return result;
}


// Titles and handlers for 5 new menu items

// 2 items without confirmation prompt

var fcaTitle1 = 'Open All Documents';
var fcaHandlers1 = {
	'beforeDisplay' : canRun,
	'onInvoke' : function() {
		var showingWindow = !ScriptUI.environment.keyboardState.shiftKey;
		var silence = ScriptUI.environment.keyboardState.altKey;
		var prevPrefs = app.scriptPreferences.userInteractionLevel;

		if (silence) {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
		}

		for (var i = app.activeBook.bookContents.length -1; i >= 0; i--) {
			app.open(app.activeBook.bookContents[i].fullName, showingWindow);
		}
		app.scriptPreferences.userInteractionLevel = prevPrefs;
	}
};

var fcaTitle2 = 'Close All Documents';
var fcaHandlers2 = {
	'beforeDisplay' : canRun,
	'onInvoke' : function() {
		SaveOrCloseBookDocs(true, 'ASK');
	}
};

// 3 items with confirmation prompt

var fcaTitle3 = 'Save All Documents\u2026';
var fcaHandlers3 = {
	'beforeDisplay' : canRun,
	'onInvoke' : function() {
		var result = confPrompt(
			'Save All Book Documents',
			'Save all documents of \u201C' + app.activeBook.name + '\u201D?'
		)
		if (result) SaveOrCloseBookDocs();
	}
};

var fcaTitle4 = 'Save and Close All Documents\u2026';
var fcaHandlers4 = {
	'beforeDisplay' : canRun,
	'onInvoke' : function() {
		var result = confPrompt(
			'Save and Close All Book Documents',
			'Save and close all documents of \u201C' + app.activeBook.name + '\u201D?'
		)
		if (result) SaveOrCloseBookDocs(true, 'YES');
	}
};

var fcaTitle5 = 'Close All Documents without Saving\u2026';
var fcaHandlers5 = {
	'beforeDisplay' : function(ev) { canRun(ev) },
	'onInvoke' : function() {
		var result = confPrompt(
			'Close All Book Documents without Saving!',
			'Close all documents of \u201C' + app.activeBook.name + '\u201D without saving?'
		)
		if (result) SaveOrCloseBookDocs(true, 'NO');
	}
};

// Create the menu items

var fcaMenuInstaller = fcaMenuInstaller ||
(function(items) {
	var mainMenu = app.menus.item('$ID/BookPanelPopup'); // Works also: '$ID/Book Panel Menu'
	var refItem = mainMenu.menuItems.item('$ID/Save Book');
	for (var allIt = 0; allIt < items.length; allIt++) {
		// 1. Create the script menu action
		var mnuAction = app.scriptMenuActions.add(items[allIt].title);
		// 2. Attach the event listener
		for (var ev in items[allIt].handler) {
			mnuAction.eventListeners.add(ev,items[allIt].handler[ev]);
		}
		// 3. Add the menu items
		mainMenu.menuItems.add(mnuAction,LocationOptions.BEFORE, refItem);
	}
	// 4. Add a separator
	mainMenu.menuSeparators.add(LocationOptions.BEFORE, refItem);
	return true;
})([
	{title:fcaTitle1, handler:fcaHandlers1}, // Open
	{title:fcaTitle2, handler:fcaHandlers2}, // Close
	{title:fcaTitle3, handler:fcaHandlers3}, // Save
	{title:fcaTitle4, handler:fcaHandlers4}, // Save & Close
	{title:fcaTitle5, handler:fcaHandlers5}  // Close & no Save
]);


