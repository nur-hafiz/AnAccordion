(function (global) {
    const ACCORDIONS = [];
    let Accordion = function (selector, options) {
        return new Accordion.init(selector, options);
    }

    const DEFAULT_OPTIONS = {
        allowMultiReveal: false,
        transitionTime: 200,
        queueTransition: true
    }

    //Initializes accordion with all options provided by users
    //Options that are not specified by user will be provided by DEFAULT_OPTIONS
    Accordion.prototype.initOptions = function(options) {
        this.options = options;
        for (let key in DEFAULT_OPTIONS) {
            if (!this.options.hasOwnProperty(key))
                this.options[key] = DEFAULT_OPTIONS[key];
        }
    }

    //Initializes accordion groups, mainly to get the height of content
    //Sets height of first content to it's height and set the rest to 0
    Accordion.prototype.initGroups = function() {
        const GROUPS = this.accordion.querySelectorAll(".accordion__group");

        GROUPS.forEach((group, index) => {
            const GROUP = new AccordionGroup(group);

            GROUP.initGroup(index == 0, this.options.transitionTime, index == GROUPS.length - 1);
            GROUP.head.addEventListener("click", () => {
                this.handleClick(GROUP);
            });

            this.groups.push(GROUP);
        });
    }

    //Show accordion only after everything is loaded
    Accordion.prototype.afterInit = function() {
        this.accordion.style.visibility = 'visible';
        ACCORDIONS.push(this);
    }

    
    //Checks if accordion already has a group that's revealed
    //This only runs if accordion disallows multi reveal
    Accordion.prototype.hasRevealed = function () {
        const FILTERED = this.groups.filter(group => { return group.isRevealed });
        if (FILTERED.length == 0)
            return false;
        return FILTERED[0];
    }

    Accordion.prototype.handleClick = function (group) {
        let groupWasClosedOnClick = true;
        let waitForClosingAnimation = false;

        //Close it if it's already opened
        if (group.isRevealed) {
            group.close();
            groupWasClosedOnClick = false;
        }

        //If multireveal is not allowed, close existing revealed group
        if (!this.options.allowMultiReveal) {
            let revealed = this.hasRevealed();
            if (revealed) {
                revealed.close();
                waitForClosingAnimation = true;
            }
        }

        //Open group if it was closed when click
        if (groupWasClosedOnClick) {
            //Delay opening animation if we're waiting for closing animation to finish
            if (waitForClosingAnimation && this.options.queueTransition) {
                setTimeout(function () {
                    group.open()
                }, this.options.transitionTime);
            } else {
                group.open();
            }
        }

        //TODO: Add a blocker so that user can't click while transition is running
        setTimeout(() => { }, this.options.transitionTime);
    }


    //The Accordion properties
    Accordion.init = function (selector, options) {
        this.accordion = document.querySelector(selector);
        this.groups = [];
        this.isTransitioning = false;
        this.options = {};

        this.initOptions(options);
        this.initGroups();
        this.afterInit();
    }

    Accordion.init.prototype = Accordion.prototype;


    //This is the properties of individual groups in an Accordion
    function AccordionGroup(group) {
        this.transitionTime;
        this.bodyHeight;
        this.wrapper = group;
        this.head = group.querySelector(".accordion__group__head");
        this.body = group.querySelector(".accordion__group__body");
        this.isRevealed = false;
        this.wasRevealed = false;

        this.close = () => {
            this.playClosingAnimation();
            this.isRevealed = false;
            this.wrapper.classList.remove("accordion__group--revealed");
        }

        this.open = () => {
            this.playOpeningAnimation();
            this.isRevealed = true;
            this.wrapper.classList.add("accordion__group--revealed");
        }

        this.setBodyHeight = () => {
            this.body.style.height = 'auto';

            this.bodyHeight = window.getComputedStyle(this.body).getPropertyValue('height');

            if (this.isRevealed) {
                this.open()
            } else {
                this.body.style.height = 0;
            }

        }

        this.playAnimation = (height) => {
            this.wrapper.classList.add("accordion__group--animating");
            this.body.style.height = height;
            setTimeout(() => this.wrapper.classList.remove("accordion__group--animating")
                , this.transitionTime);
        }

        this.playOpeningAnimation = () => {
            return this.playAnimation(this.bodyHeight);
        }

        this.playClosingAnimation = () => {
            return this.playAnimation(0);
        }

        //Sets the first group content in an Accordion to be it's height
        //Sets the rest the remaining group contents to 0 height
        this.initGroup = (isFirstItem, transitionTime, isLastItem) => {
            this.setBodyHeight();
            if (isFirstItem) {
                this.isRevealed = true;
                this.wasRevealed = true;
                this.open();
            } else {
                this.close();
            }

            if (isLastItem) {
                this.wrapper.classList.add('accordion__group--last');
            }

            this.transitionTime = transitionTime;
            this.body.style.transition = transitionTime.toString() + 'ms';
        }


    }


    //This chunk is to resize the accordion groups when the window is resized
    var debounceId;

    // Debounce function: Input as function which needs to be debounced and delay is the debounced time in milliseconds
    var debounce = function (func, delay) {
        // Cancels the setTimeout method execution
        clearTimeout(debounceId)
        // Executes the func after delay time.
        debounceId = setTimeout(func, delay)
    }


    global.addEventListener('resize', function () {
        debounce(() =>
            Accordions.forEach(accordion =>
                accordion.groups.forEach(group =>
                    group.setBodyHeight())
            ), 750
        );

    });

    global.Accordion = Accordion;
}(window));

const newAccordion = Accordion('.accordion', { allowMultiReveal: true, transitionTime: 1500, queueTransition: false });

const anotherAccordion = Accordion('.accordion-2', { allowMultiReveal: true, queueTransition: false });

const anotherAccoordion = Accordion('.accordion-3', { allowMultiReveal: false, queueTransition: true });

const fourthAccoordion = Accordion('.accordion-4', { allowMultiReveal: false, transitionTime: 1500, queueTransition: false });
