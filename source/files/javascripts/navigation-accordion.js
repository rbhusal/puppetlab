// This relies on Bootstrap's collapse.js.
$( document ).ready( function() {
    "use strict";

    // Nav list: A nav snippet for one particular lg. versioned document.
    var navLists = $( "nav.main > ul" );
    // Nav header: The title of a given nav list. Usually just the name of the document.
    var navHeaders = $( "nav.main > h2, nav.main > h3" );
    // Sub-list: A list within a nav list.
    var navSubLists = navLists.find('ul');
    // Nav section: An li element containing at least one sub-list and usually a title with <strong> markup.
    var navSections = navLists.find('li:has(ul)');

    // Find nav links to current page...
            // To make the regex, we transform the current page's pathname to:
            // - allow "/latest/" to also match any numerical version
            // - handle "/" and "/index.html" identically.
        var normalizedLocation = location.pathname.replace(/\/latest\//, "/(latest|[\\d\\.]+)/").replace(/(\/|\/index.html)$/, "/(index.html)?") + '$';
        var locationRegexp = new RegExp(normalizedLocation);
        var isLinkToCurrentPage = function(index, element) {
            return locationRegexp.test( $( element ).prop( "href" ) );
        };
    var navLinksToCurrentPage = navLists.find("a").filter( isLinkToCurrentPage );

    // Active nav sub-list: One that contains a link to the current page (directly, or in a sub-sub-list.)
    var activeNavSections = navLinksToCurrentPage.parentsUntil(navLists).filter(navSections);

    // Disable links to current page
    navLinksToCurrentPage.addClass("disabled-nav-link");
    navLinksToCurrentPage.on("click", function(e) { e.preventDefault(); } );

    // Generic functions for collapsing something and twiddling a ± button at the same time
    var toggleSection = function(label, target) {
        label.toggleClass("hidden-nav expanded-nav");
        target.collapse('toggle');
    };
    var hideSection = function(label, target) {
        label.addClass("hidden-nav").removeClass("expanded-nav");
        target.collapse('hide');
    };
    var showSection = function(label, target) {
        label.addClass("expanded-nav").removeClass("hidden-nav");
        target.collapse('show');
    };

    // Allow nav sections to toggle their sublist if you click the ± sign or label
    navSections.on( {
        "click": function(e) {
            if (e.target === this || e.target === $(this).children('strong')[0]) {
                e.stopPropagation();
                $(this).trigger('toggleSection');
            }
        },
        "toggleSection": function(e) {
            e.stopPropagation();
            toggleSection( $(this), $(this).children('ul') );
        },
        "hideSection": function(e) {
            e.stopPropagation();
            hideSection( $(this), $(this).children('ul') );
        },
        "showSection": function(e) {
            e.stopPropagation();
            showSection( $(this), $(this).children('ul') );
        }
    });

    // Mark sublists as collapsed.
    navSubLists.addClass('collapse');
    navSections.addClass("hidden-nav");
    // Uncollapse the active ones.
    activeNavSections.trigger('click');

    // Add a "toggle all" control for each nav list with at least one sub-list.
    navLists.each( function(index, element) {
        var thisNavList = $(element);
        if ( thisNavList.find(navSubLists).length > 0 ) {
            // Add the toggle control
            thisNavList.before( '<p style="text-align: center;"><a href="#" class="toggle-all-nav-sections">(↓ expand all ↓)</a></p>' );
            // Wire up the click to the <a> in the toggle control
            thisNavList.prev().children('a').on('click', function(e) {
                e.preventDefault();
                var toggleButton = $( this )
                if ( toggleButton.text() === '(↓ expand all ↓)' ) {
                    thisNavList.find(navSections).trigger("showSection");
                    toggleButton.text('(↑ collapse all ↑)');
                } else {
                    thisNavList.find(navSections).trigger("hideSection");
                    toggleButton.text('(↓ expand all ↓)');
                }
            });
        }
    });




    // Mark top-level nav lists as collapsable.
    navLists.addClass('collapse').addClass('in');


});
