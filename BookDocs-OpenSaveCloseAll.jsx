/*********************************************************************/
/*                                                                   */
/*    BookOpenAll :: Add an "Open All" feature in the Book  Menu     */
/*                                                                   */
/*    [Ver: 1.00]         [Author: Jongware]    [Creat: 04-Jun-2012] */
/*    [Lang: EN]          [Tested on: InDesign CS4/CS5/CS5.5]        */
/*                                                                   */
/*    Installation:                                                  */
/*                                                                   */
/*    1) Place this script file into Scripts/Startup Scripts/        */
/*       (if the folder Startup Scripts doesn't exist, create it)    */
/*    2) Restart InDesign to make it load                            */
/*                                                                   */
/*    Modified from Marc Autret's "File Close All" script at         */
/* http://www.indiscripts.com/post/2010/02/how-to-create-your-own-indesign-menus */
/*                                                                   */
/*    ... gosh that URL is a bit long ...                            */
/*                                                                   */
/*********************************************************************/

#targetengine "BookOpenAll"


// THE MAIN PROCESS
// -----------------------------------------------
var fcaTitle = "Open Book Documents";
var fcaHandlers = {
	'beforeDisplay' : function(ev)
		{
			ev.target.enabled = (app.books.length>0 && app.activeBook.bookContents.length > 0);
		},

	'onInvoke' : function()
		{
			var i;
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
			for (var i = app.activeBook.bookContents.length-1; i>=0; i--)
			{
				app.open (app.activeBook.bookContents[i].fullName, true)
			}
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
		}
	};


var fcaTitle2 = "Close Book Documents";
var fcaHandlers2 = {
	'beforeDisplay' : function(ev)
		{
			ev.target.enabled = (app.books.length>0 && app.activeBook.bookContents.length > 0);
		},

	'onInvoke' : function()
		{
			var i;
			for(i = app.activeBook.bookContents.length-1; i>=0 ; i-- )
			{
				app.open (app.activeBook.bookContents[i].fullName, false).close(SaveOptions.ASK);
			}
		}
	};


// THE MENU INSTALLER
// -----------------------------------------------
var fcaMenuInstaller = fcaMenuInstaller||
(function(items)
{
	var allIt;
	for (allIt=0; allIt<items.length; allIt++)
	{
		// 1. Create the script menu action
		var mnuAction = app.scriptMenuActions.add(items[allIt].title);

		// 2. Attach the event listener
		var ev;
		for( ev in items[allIt].handler )
			{
				mnuAction.eventListeners.add(ev,items[allIt].handler[ev]);
			}

		// 3. Create the menu items
		var mainMenu = app.menus.item("$ID/Book Panel Menu");
		var refItem = mainMenu.menuItems.item("$ID/Close Book");

		mainMenu.menuItems.add(mnuAction,LocationOptions.BEFORE,refItem);
	}
	return true;
})( [{title:fcaTitle, handler:fcaHandlers},{title:fcaTitle2, handler:fcaHandlers2}]);
