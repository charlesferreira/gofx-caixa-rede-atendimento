var Ad = function(options) {
    this.setup(options, {
        width: 300,
        height: 250,
        autoPlayTimeOut: 6000,
        autoPlayMaxTimeOut: 20000,
        effects: {
            //exemplo: { transition: '0.5s ease-in-out', delay: 2500 }
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

Ad.prototype.onDragStart = function(event) {
    this.isTeasing = false;
    if (this.isAutoPlaying) return this;
    this.dragging = true;
    this.dragStartX = event.clientX;
    console.log("onDragStart");
}

Ad.prototype.onDragFinish = function() {
    if (this.isAutoPlaying) return this;
    this.dragging = false;
    console.log("onDragFinish");
}

Ad.prototype.onDragUpdate = function(event) {
    if (this.dragging) {
        var x = event.clientX - this.dragStartX;
        gwd.actions.events.setInlineStyle('drag', 'transform: translateX(' + x + 'px)');
        gwd.actions.events.setInlineStyle('drag-mask',
            'background-position: ' + (this.width - x) + 'px center');
    }
}

Ad.prototype.onTeaseOver = function() {
    this.isTeasing = true;
    var teaseLeft = 31;
    var bgLeft = this.width - teaseLeft
    this.animate('drag', '0.5s ease-out', {transform: 'translateX(' + teaseLeft + 'px)'})
        .animate('drag-mask', '0.5s ease-out', {
            'background-position': bgLeft + 'px center'});
}

Ad.prototype.onTeaseOut = function() {
    if (!this.isTeasing) return this;
    this.isTeasing = false;
    this.animate('drag', '0.5s ease-in', {transform: 'translateX(0px)'})
        .animate('drag-mask', '0.5s ease-in', {
            'background-position': this.width + 'px center'});
}