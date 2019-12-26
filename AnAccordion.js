(function (global) {
    let Accordion = function (selector, options) {
        return new Accordion.init(selector, options);
    }

    Accordion.prototype = {
        //Initializes accordion with all options provided by users
        //Options that are not specified by user will be provided by defaultOptions
        initOptions: function (options) {
            self.options = options;
            for (let key in defaultOptions) {
                if (!self.options.hasOwnProperty(key))
                    self.options[key] = defaultOptions[key];
            }
        },

        //Initializes accordion groups, mainly to get the height of content
        //Sets height of first content to it's height and set the rest to 0
        initGroups: function () {
            self.accordion.querySelectorAll(".accordion__group").forEach((accordionGroup, index) => {
                const group = new AccordionGroup(accordionGroup);
                self.groups.push(group);
                group.initGroup(index, self.options.transitionTime);
                group.head.addEventListener("click", function () {
                    self.handleClick(group);
                });
            });
        },

        //Show accordion only after everything is loaded
        afterInit: function () {
            self.accordion.style.visibility = 'visible';
        },

        //Checks if accordion already has a group that's revealed
        //This only runs if accordion disallows multi reveal
        hasRevealed: function () {
            let filtered = self.groups.filter(group => { return group.isRevealed });
            if (filtered.length == 0) {
                return false;
            }
            return filtered[0];
        },

        handleClick: function (group) {
            let groupWasClosedOnClick = true;
            let waitForClosingAnimation = false;

            //Close it if it's already opened
            if (group.isRevealed) {
                group.close();
                groupWasClosedOnClick = false;
            }

            //If multireveal is not allowed, close existing revealed group
            if (!self.options.allowMultiReveal) {
                let revealed = self.hasRevealed();
                if (revealed) {
                    revealed.close();
                    waitForClosingAnimation = true;
                }
            }

            //Open group if it was closed when click
            if (groupWasClosedOnClick) {
                //Delay opening animation if we're waiting for closing animation to finish
                if (waitForClosingAnimation && self.options.queueTransition) {
                    setTimeout(function () {
                        group.open()
                    }, self.options.transitionTime);
                } else {
                    group.open();
                }
            }

            //TODO: Add a blocker so that user can't click while transition is running
            setTimeout(() => { }, self.options.transitionTime);
        }
    }

    //The default options given if users do not provide
    var defaultOptions = {
        allowMultiReveal: false,
        transitionTime: 200,
        queueTransition: true
    }

    //The Accordion properties
    Accordion.init = function (selector, options) {
        self = this;
        self.accordion = document.querySelector(selector);
        self.groups = [];
        self.isTransitioning = false;
        self.options = {};

        self.initOptions(options);
        self.initGroups();
        self.afterInit();
    }

    Accordion.init.prototype = Accordion.prototype;

    global.Accordion = Accordion;

    //This is the properties of individual groups in an Accordion
    function AccordionGroup(group) {
        this.wrapper = group;
        this.head = group.querySelector(".accordion__group__head");
        this.body = group.querySelector(".accordion__group__body");
        this.bodyHeight = window.getComputedStyle(this.body).getPropertyValue('height');
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

        this.playAnimation = (height) => {
            this.body.style.height = height;
        }

        this.playOpeningAnimation = () => {
            return this.playAnimation(this.bodyHeight);
        }

        this.playClosingAnimation = () => {
            return this.playAnimation(0);
        }

        //Sets the first group content in an Accordion to be it's height
        //Sets the rest the remaining group contents to 0 height
        this.initGroup = (isFirstItem, transitionTime) => {
            if (!isFirstItem) {
                this.isRevealed = true;
                this.wasRevealed = true;
                this.open();
            } else {
                this.close();
            }
            this.body.style.transition = transitionTime.toString() + 'ms';
        }


    }


}(window));

const newAccordion = Accordion('.accordion', { transitionTime: 200, queueTransition: true });

const anotherAccordion = Accordion('.accordion-2', { allowMultiReveal: false });

const anotherAccoordion = Accordion('.accordion-3', { allowMultiReveal: false });

const fourthAccoordion = Accordion('.accordion-4', { allowMultiReveal: false });
