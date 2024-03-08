# BookDocs-OpenSaveCloseAll

A script for Adobe InDesign.

The script is based on a script “BookOpenAll“, downloaded from [here](https://creativepro.com/add-missing-options-to-the-book-menu/) (Theunis De Jong, 2012).

Other variants and related discussion on *hilfdirselbst*: [1](https://www.hilfdirselbst.ch/gforum/gforum.cgi?post=555008#555008), [2](https://indesign.hilfdirselbst.ch/2017/01/alle-dateien-im-indesign-buch-offnen.html).

## Improvements over the original version: 

- More functionality: Open, close, save all
- Confirmation for potentially dangerous actions
- Close All closes only book documents that actually are open

Details see below.

### More functionality

The script adds these menu entries to the Book menu:

- Open All Book Documents
- Close All Book Documents
- Save All Book Documents…
- Save and Close All Book Documents…
- Close All Book Documents w/o Saving…

The “Open All Book Documents” is the non-silenced variant, i.e. `UserInteractionLevels` is *not* forced to `neverInteract`. I may change this in the future, or you can just uncomment the corresponding lines in the script if you prefer the silenced way.

### Confirmations

All functions where the menu item ends in an ellipsis bring up a confirmation dialog. I prefer it this way, because it is easy to misclick a menu item, and accidentally closing all book documents without saving (or with saving all) is not a nice experience.

To be extra safe, the confirmation dialog also shows the name of the book that Indesign considers to be the active book, so it should be less likely that you accidentally close all docs of the wrong book.

### Close only book documents that are actually open

In the original version, book documents are closed using a somewhat cumbersome procedure:

```JavaScript
app.open (app.activeBook.bookContents[i].fullName, false).close(SaveOptions.ASK)
```

That is, to close a document, it first opens it and then immediately closes it again. For example, if you have a book with 15 documents, 4 of which are open, the script will also open the 11 unopened documents, only to close them again.

I found it more straightforward to just iterate through the open documents, test if a document belongs to the active book, and close it if true. The test can be done with – IMO – sufficient reliability by comparing the `fullName` string (path + filename) of the open document with that of the members of the active book.

This also prevents the modification dates of the files from being changed for no reason.

So far, it works like a charm, and I'm still wondering why the original script resorted to this bizarre open-all-and-close-again strategy. But maybe I'm missing something (if so, please let me know).




