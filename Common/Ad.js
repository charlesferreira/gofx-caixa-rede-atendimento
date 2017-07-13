var Ad = function(options) {
    this.setup(options, {
        width: 300,
        height: 250,
        autoPlayTimeOut: 5000,
        autoPlayMaxTimeOut: 20000,
        effects: {
            demo: { transition: '0.5s ease-in-out', delay: 2500 }
        },
    });
}

Ad.prototype.setup = function(options, defaultOptions) {
    for (var i in defaultOptions) this[i] = options[i] || defaultOptions[i];
    return this
        .fadeOut('txt-tem')
        .setupImages()
        .setupAutoPlay();
}

Ad.prototype.setupAutoPlay = function() {
    setTimeout(function() {
        if (!this.isAutoPlaying)
            this.autoPlay();
    }.bind(this), this.autoPlayMaxTimeOut);
    return this.resetAutoPlay();
}

Ad.prototype.resetAutoPlay = function() {
    if (this.autoPlayTimeOutId) clearTimeout(this.autoPlayTimeOutId);
    this.autoPlayTimeOutId = setTimeout(this.autoPlay.bind(this), this.autoPlayTimeOut);
    this.isAutoPlaying = false;
    return this;
}

Ad.prototype.autoPlay = function() {
    console.log("autoplaying");
    this.isAutoPlaying = true;
    return this;
}

Ad.prototype.setupImages = function() {
    return this
        .fadeOut('logo');
}

Ad.prototype.fadeOut = function(element, options) {
    return this.fadeTo(0, element, options);
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