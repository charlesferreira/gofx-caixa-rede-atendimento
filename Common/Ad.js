var Ad = function(options) {
    this.setup(options, {
        width: 300,
        height: 250,
        /*
        numPictures: 4,
        frameDuration: 1100,
        arrowOpacityOn: 0.825,
        arrowOpacityOff: 0.53,
        autoPlayTimeOut: 5000,
        autoPlayInterval: 2500,
        autoPlayMaxTimeOut: 20000,
        effects: {
            overlayFadeOut: { transition: '0.5s ease-in', delay: 2000 },
            arrowsSlideIn: { transition: '1.0s ease-out', delay: 1500 },
            arrowsSlideOut: { transition: '1.0s ease-in' },
            arrowLeftFade: { transition: '0.5s ease-out' },
            framePhotoSlideIn: { transition: '0.8s ease-in-out' },
            framePhotoSlideOut: { transition: '0.8s ease-in-out' },
            frameTextSlideIn: { transition: '0.4s ease-out', delay: 600 },
            frameTextSlideOut: { transition: '0.35s ease-in' },
            underlayCrossFade: { transition: '0.5s ease-in-out', delay: 2500 }
        },
        */
    }).start();
}

Ad.prototype.setup = function(options, defaultOptions) {
    for (var i in defaultOptions)
        this[i] = options[i] || defaultOptions[i];
    this.currentFrame = 0;
    return this
        .fadeOut('txt-tem')
        .setupImages()
        .setupAutoPlay();
}

Ad.prototype.setupAutoPlay = function() {
    setTimeout(function() {
        if (!this.isAutoPlaying)
            this.autoPlay();
        this.slideOutArrows();
    }.bind(this), this.autoPlayMaxTimeOut);
    return this.resetAutoPlay();
}

Ad.prototype.resetAutoPlay = function() {
    if (this.autoPlayTimeOutId) clearTimeout(this.autoPlayTimeOutId);
    if (this.autoPlayIntervalId) clearInterval(this.autoPlayIntervalId);
    this.autoPlayTimeOutId = setTimeout(this.autoPlay.bind(this), this.autoPlayTimeOut);
    this.isAutoPlaying = false;
    return this;
}

Ad.prototype.autoPlay = function() {
    this.autoPlayIntervalId = setInterval(this.navigate.bind(this, +1), this.autoPlayInterval);
    this.isAutoPlaying = true;
    return this.navigate(+1);
}

Ad.prototype.setupImages = function() {
    return this
        .fadeOut('logo');
}

Ad.prototype.setupArrows = function() {
    return this
        .slideOutLeft('arr-left')
        .slideOutRight('arr-right')
        .slideIn('arr-right', this.effects.arrowsSlideIn)
        .slideIn('arr-left', this.effects.arrowsSlideIn)
        .fadeTo(this.arrowOpacityOff, 'arr-left')
        .fadeTo(this.arrowOpacityOn, 'arr-right');
}

Ad.prototype.start = function() {
    return this
        .fadeOut('overlay-img', this.effects.overlayFadeOut)
        .fadeOut('overlay-txt', this.effects.overlayFadeOut);
}

Ad.prototype.slideIn = function(element, options) {
    options = options || {};
    return this.animate(element, options.transition, {
        transform: 'translateX(0px)'
    }, options.delay);
}

Ad.prototype.slideOutLeft = function(element, options) {
    options = options || {};
    return this.animate(element, options.transition, {
        transform: 'translateX(-' + this.width + 'px)'
    }, options.delay);
}

Ad.prototype.slideOutRight = function(element, options) {
    options = options || {};
    return this.animate(element, options.transition, {
        transform: 'translateX(' + this.width + 'px)'
    }, options.delay || 0);
}

Ad.prototype.fadeOut = function(element, options) {
    return this.fadeTo(0, element, options);
}

Ad.prototype.fadeIn = function(element, options) {
    return this.fadeTo(1, element, options);
}

Ad.prototype.fadeTo = function(opacity, element, options) {
    options = options || {};
    return this.animate(element, options.transition, {
        opacity: opacity
    }, options.delay);
}

Ad.prototype.animate = function(element, transition, properties, delay) {
    setTimeout(function() {
        var style = transition ? ['transition:all ' + transition ] : [];
        for (var i in properties)
            style.push(i + ':' + properties[i]);
        window.gwd.actions.events.setInlineStyle(element, style.join(';'));
    }.bind(this), delay || 0);
    return this;
}

Ad.prototype.onRightArrowClick = function() {
    return this
        .resetAutoPlay()
        .navigate(+1);
}

Ad.prototype.onLeftArrowClick = function() {
    return this
        .resetAutoPlay()
        .navigate(-1);
}

Ad.prototype.navigate = function(increment) {
    if (this.busy || (increment < 0 && this.currentFrame < 1))
        return this;
    this.setBusy(this.frameDuration);

    // slide out
    var slideOut = (increment > 0 ? this.slideOutLeft : this.slideOutRight).bind(this);
    slideOut('pic-' + this.currentFrame, this.effects.framePhotoSlideOut)
    slideOut('txt-' + this.currentFrame, this.effects.frameTextSlideOut);

    // slide in
    this.currentFrame += increment;
    this.slideIn('pic-' + this.currentFrame, this.effects.framePhotoSlideIn)
        .slideIn('txt-' + this.currentFrame, this.effects.frameTextSlideIn);

    // arrows
    switch(this.currentFrame) {
        case 0: return this.fadeTo(this.arrowOpacityOff, 'arr-left', this.effects.arrowLeftFade);
        case 1: return this.fadeTo(this.arrowOpacityOn, 'arr-left', this.effects.arrowLeftFade);
        case 4: return this
            .slideOutArrows()
            .playLastFrame();
        default: return this;
    }
}

Ad.prototype.setBusy = function(duration) {
    this.busy = true;
    setTimeout(function() {
        this.busy = false;
    }.bind(this), duration);
}

Ad.prototype.slideOutArrows = function() {
    return this
        .slideOutLeft('arr-left', this.effects.arrowsSlideOut)
        .slideOutRight('arr-right', this.effects.arrowsSlideOut);
}

Ad.prototype.playLastFrame = function() {
    return this
        .fadeOut('underlay-txt', this.effects.underlayCrossFade)
        .fadeIn('underlay-logo', this.effects.underlayCrossFade);
}