'use strict';

/*
Tab selector - Code by Zsolt Kiraly
v1.0.5 - 2018-03-28
*/

var tabSelector = function() {

    function tab(tS, tL, c, sN) {
        var tabList = tS.querySelectorAll('.tab-list .list-element.active'),
            tabSelectorWidth = tS.querySelector('.tab-list').offsetWidth;

        var i = 1,
            row = 0,
            column = 1,
            rowLength = c.desktop,
            lentabList = tabList.length;

        if(window.matchMedia("only screen and (max-width: 998px)").matches) { rowLength = c.tablet; }
        if(window.matchMedia("only screen and (max-width: 599px)").matches) { rowLength = c.mobile; }
        if(window.matchMedia("only screen and (max-width: 399px)").matches) { rowLength = c.sMobile; }

        var allRow = Math.ceil(lentabList / rowLength);

        tS.querySelector('.tab-list').style.height = (allRow * c.contentHeight) + 'px';

        for (; i < lentabList; i++) {

            var element = tabList[i];

            if (i % rowLength == 0) {
                row++;
                column = 0;
            }

            element.style.left = (column * (tabSelectorWidth / rowLength)) + 'px';

            column++;

            element.style.top = (row * c.contentHeight) + 'px';
        }

        tL.forEach(function(allElement, index, arr) {

            var elementLen = arr.length;

            allElement.style.width = ((100 / rowLength).toFixed(4)) + '%';
            allElement.style.height = c.contentHeight + 'px';

            if(window.matchMedia("only screen and (max-width: 998px)").matches) { allElement.style.width = ((100 / rowLength).toFixed(4)) + '%'; }
            if(window.matchMedia("only screen and (max-width: 599px)").matches) { allElement.style.width = ((100 / rowLength).toFixed(4)) + '%'; }
            if(window.matchMedia("only screen and (max-width: 399px)").matches) { allElement.style.width = ((100 / rowLength).toFixed(4)) + '%'; }
        })
    }

    function prevDisabled(prev, next) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    }

    function nextDisabled(prev, next) {
        next.classList.add('disabled');
        prev.classList.remove('disabled');
    }

    function removeDisabledAll(prev, next) {
        next.classList.remove('disabled');
        prev.classList.remove('disabled');
    }

    function addDisabledAll(prev, next) {
        next.classList.add('disabled');
        prev.classList.add('disabled');
    }

    function reset(first) {
        first.style.left = '0px';
        first.style.top = '0px';
    }

    function mobileMenuDOM(tS, tM, c) {
        var mobileContainer = tS.querySelector('.tab-menu .content');

        if (mobileContainer) {

            var mobileContent = document.createElement('DIV');
            mobileContent.setAttribute('class', 'mobile-menu');
            mobileContainer.insertBefore(mobileContent, mobileContainer.lastChild);

            var mobileMenu = tS.querySelector('.tab-menu .content .mobile-menu');
            mobileMenu.innerHTML =
                '<div class="prev disabled"><i class="' + c.prev + '" aria-hidden="true"></i></div>' +
                '<div class="element"></div>' +
                '<div class="next"><i class="' + c.next +'" aria-hidden="true"></i></div>';

            var mobileElement = mobileMenu.querySelector('.element'),
                mobilePrev = mobileMenu.querySelector('.prev'),
                mobileNext = mobileMenu.querySelector('.next');

            mobileElement.innerHTML = tM[0].innerHTML;
        }
    }

    function menu(tS, tM, tL, c) {

        var prevButton = tS.querySelector('.mobile-menu .prev');
        var textContent = tS.querySelector('.mobile-menu .element');
        var nextButton = tS.querySelector('.mobile-menu .next');

        tM.forEach(function(tabMenus, index, arr) {

            tabMenus.addEventListener('click', function() {

                var obj = this;
                var objId = obj.getAttribute('data-id');

                textContent.innerHTML = obj.innerHTML;

                if(parseFloat(objId) === 0) {
                    prevDisabled(prevButton, nextButton);
                }

                if(parseFloat(objId) === arr.length - 1) {
                    nextDisabled(prevButton, nextButton);
                }

                tM.forEach(function(menuElement, index, arr) {
                    if (obj == menuElement) {
                        menuElement.classList.add('active');

                    } else {
                        menuElement.classList.remove('active');
                    }
                })

                tL.forEach(function(tabLists, index, arr) {
                    var getDataId = tabLists.getAttribute('data-id');
                    var array = JSON.parse('[' + getDataId + ']');
                    var arrayId = array.includes(parseInt(objId));

                    if(arrayId != true) {
                        tabLists.classList.remove('active');
                        reset(tabLists);

                    } else {
                        tabLists.classList.add('active');
                        reset(tabLists);
                    }

                    if (objId == 0) {
                        tabLists.classList.add('active');
                    }
                })

                tab(tS, tL, c);

            }, false);

        })

        function prev() {
            var activeMenuElement = tS.querySelector('.tab-menu ul li.active');

            var firstElement = tM[0];

            var prevMenuElement = activeMenuElement.previousElementSibling;

            if (activeMenuElement != firstElement) {
                textContent.innerHTML = prevMenuElement.innerHTML;

                activeMenuElement.classList.remove('active');
                prevMenuElement.classList.add('active');

                var activeGetId = Number(activeMenuElement.getAttribute('data-id')) - 1;

                tL.forEach(function(tabLists, index, arr) {

                    var getDataId = tabLists.getAttribute('data-id');
                    var array = JSON.parse('[' + getDataId + ']');
                    var arrayId = array.includes(parseInt(activeGetId));

                    if(arrayId != true) {
                        tabLists.classList.remove('active');
                        reset(tabLists);

                    } else {
                        tabLists.classList.add('active');
                        reset(tabLists);

                    }

                    if (activeGetId == 0) {
                        tabLists.classList.add('active');
                    }
                })

                tab(tS, tL, c);
            } 

            if(tM.length > 1) {
                if(activeMenuElement == tM[1] || activeMenuElement == firstElement) {
                    prevDisabled(prevButton, nextButton);

                } else {
                    removeDisabledAll(prevButton, nextButton);
                }
            }
        }


        function next() {
            var activeMenuElement = tS.querySelector('.tab-menu ul li.active');

            var lastElement = tM[tM.length - 1];
            var nextMenuElement = activeMenuElement.nextElementSibling;

            if (activeMenuElement != lastElement) {
                textContent.innerHTML = nextMenuElement.innerHTML;

                activeMenuElement.classList.remove('active');
                nextMenuElement.classList.add('active');

                var activeGetId = Number(activeMenuElement.getAttribute('data-id')) + 1;


                tL.forEach(function(tabLists, index, arr) {
                    var getDataId = tabLists.getAttribute('data-id');
                    var array = JSON.parse('[' + getDataId + ']');
                    var arrayId = array.includes(parseInt(activeGetId));

                    if(arrayId != true) {
                        tabLists.classList.remove('active');
                        reset(tabLists);

                    } else {
                        tabLists.classList.add('active');
                        reset(tabLists);
                    }

                    if (activeGetId == 0) {
                        tabLists.classList.add('active');
                    }
                })

                tab(tS, tL, c);

            }

            if(tM.length > 1) {
                if(activeMenuElement == tM[tM.length - 2] || activeMenuElement == lastElement) {
                    nextDisabled(prevButton, nextButton)
                    
                } else {
                    removeDisabledAll(prevButton, nextButton);
                }
            }
        }

        prevButton.addEventListener('click', function() {
            prev();
        }, false);

        nextButton.addEventListener('click', function() {
            next();
        }, false);


        var startx = 0;
        var dist = 0;

        tS.addEventListener('touchstart', function(e) {
            var touchobj = e.changedTouches[0];
            startx = parseInt(touchobj.clientX);
        }, false);


        tS.addEventListener('touchend', function(e) {

            var touchobj = e.changedTouches[0];
            var dist = parseInt(touchobj.clientX) - startx;

            if (dist > 50) {
                prev();

            } else if (dist < -50) {
                next();
            }

        }, false);

        if(tM.length === 1) {
            addDisabledAll(prevButton, nextButton);

            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
            }, false);

            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
            }, false);
        }

        prevButton.classList.add('disabled');
    }

    function loading(container) {
        setTimeout(function() {
            container.classList.remove('show');

            setTimeout(function() {
                container.classList.remove('loading');
            }, 500);

        }, 500);
    }

    function app(config) {

        var tabAnimationContainer = document.querySelector('#' + config.contentBox);

        if(tabAnimationContainer) {
            var tabSelector = tabAnimationContainer.querySelector('.tab-selector');

            if (tabSelector) {
                var tabMenu = tabSelector.querySelectorAll('.tab-menu ul li'),
                    tabList = tabSelector.querySelectorAll('.tab-list .list-element');

                mobileMenuDOM(tabSelector, tabMenu, config);

                window.addEventListener('resize', function() {
                    var scrollNull = 0;

                    tab(tabSelector, tabList, config, scrollNull);
                }, false);

                tab(tabSelector, tabList, config);
                menu(tabSelector, tabMenu, tabList, config);
            }
            loading(tabAnimationContainer);
        }
    }

    return {
        app: app
    }

}();