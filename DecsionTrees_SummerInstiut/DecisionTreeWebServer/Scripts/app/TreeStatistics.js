function getStandardNormalZ(p) {
    if (p > 1 || p < 0) {
        alert("Error: p =" + p.toString() + ", Z cannot be computed");
        return null;
    }
    var tmp_p = 0.0;
    var lfStandardNormalZ = 0.0;
    tmp_p = evaluateStandardNormalZ(lfStandardNormalZ);
    while (tmp_p < p) {
        lfStandardNormalZ += 0.0001;
        tmp_p = evaluateStandardNormalZ(lfStandardNormalZ);
        if (p - tmp_p < 0.0000001)
            break;
    }
    while (tmp_p > p) {
        lfStandardNormalZ -= 0.0001;
        tmp_p = evaluateStandardNormalZ(lfStandardNormalZ);
        if (tmp_p - p < 0.0000001)
            break;
    }
    return lfStandardNormalZ;
}
function evaluateStandardNormalZ(z) {
    var prob = 0.0;
    var temp = 0.0;
    var zt = z;
    z = Math.abs(z);
    temp = 1.0 + 0.049867347 * z + 0.0211410061 * Math.pow(z, 2.0) + 0.0032776263 * Math.pow(z, 3.0) + 0.0000380036 * Math.pow(z, 4.0) + 0.0000488906 * Math.pow(z, 5.0) + 0.000005383 * Math.pow(z, 6.0);
    if (zt < 0) {
        prob = 0.5 * Math.pow(temp, -16.0);
    }
    else {
        prob = 1.0 - (0.5 * Math.pow(temp, -16.0));
    }
    return prob;
}
var TreeStatistics = (function () {
    function TreeStatistics() {
        this._undecidedSuccessCount = 0;
        this._undecidedFailureCount = 0;
        this._hitCount = 0;
        this._missCount = 0;
        this._faCount = 0;
        this._crCount = 0;
        this._stepsSum = 0;
    }
    //</fields>
    //<getters/setters>
    TreeStatistics.prototype.getUndecidedSuccessCount = function () {
        return this._undecidedSuccessCount;
    };
    TreeStatistics.prototype.setUndecidedSuccessCount = function (value) {
        this._undecidedSuccessCount = value;
    };
    TreeStatistics.prototype.getUndecidedFailureCount = function () {
        return this._undecidedFailureCount;
    };
    TreeStatistics.prototype.setUndecidedFailureCount = function (value) {
        this._undecidedFailureCount = value;
    };
    TreeStatistics.prototype.getHitCount = function () {
        return this._hitCount;
    };
    TreeStatistics.prototype.setHitCount = function (value) {
        this._hitCount = value;
    };
    TreeStatistics.prototype.getMissCount = function () {
        return this._missCount;
    };
    TreeStatistics.prototype.setMissCount = function (value) {
        this._missCount = value;
    };
    TreeStatistics.prototype.getFaCount = function () {
        return this._faCount;
    };
    TreeStatistics.prototype.setFaCount = function (value) {
        this._faCount = value;
    };
    TreeStatistics.prototype.getCrCount = function () {
        return this._crCount;
    };
    TreeStatistics.prototype.setCrCount = function (value) {
        this._crCount = value;
    };
    TreeStatistics.prototype.getStepsSum = function () {
        return this._stepsSum;
    };
    TreeStatistics.prototype.setStepsSum = function (value) {
        this._stepsSum = value;
    };
    //</getters/setters>
    //<instance methods>
    TreeStatistics.prototype.allCases = function () {
        return this._hitCount + this._missCount + this._faCount + this._crCount + this.undecidedCases();
    };
    TreeStatistics.prototype.undecidedCases = function () {
        return this._undecidedFailureCount + this._undecidedSuccessCount;
    };
    TreeStatistics.prototype.frugality = function () {
        return this._stepsSum / this.allCases();
    };
    TreeStatistics.prototype.getHitsProbability = function () {
        if (this.getHitCount() === 0 && this.getMissCount() === 0)
            return undefined;
        else if (this.getHitCount() === 0)
            return (1 / (2 * this.allCases()));
        else if (this.getMissCount() === 0)
            return (1 - (1 / (2 * this.allCases())));
        else
            return this.getHitCount() / (this.getHitCount() + this.getMissCount());
    };
    TreeStatistics.prototype.getZofHitsProbability = function () {
        return getStandardNormalZ(this.getHitsProbability());
    };
    TreeStatistics.prototype.getFalseAlarmsProbability = function () {
        if (this.getFaCount() === 0 && this.getCrCount() == 0)
            return undefined;
        else if (this.getFaCount() === 0)
            return (1 / (2 * this.allCases()));
        else if (this.getCrCount() === 0)
            return (1 - (1 / (2 * this.allCases())));
        else
            return this.getFaCount() / (this.getFaCount() + this.getCrCount());
    };
    TreeStatistics.prototype.getZofFalseAlarmsProbability = function () {
        return getStandardNormalZ(this.getFalseAlarmsProbability());
    };
    TreeStatistics.prototype.getDPrime = function () {
        return this.getZofHitsProbability() - this.getZofFalseAlarmsProbability();
    };
    TreeStatistics.prototype.getBias = function () {
        return -0.5 * (this.getZofHitsProbability() + this.getZofFalseAlarmsProbability());
    };
    TreeStatistics.prototype.getAPrime = function () {
        var x = this.getFalseAlarmsProbability();
        var y = this.getHitsProbability();
        return 0.5 + ((y - x) * (1 + y - x)) / (4 * y * (1.0 - x));
    };
    TreeStatistics.prototype.getBPrime = function () {
        var x = this.getFalseAlarmsProbability();
        var y = this.getHitsProbability();
        y = y >= 1.0 ? 0.999999 : y;
        x = x >= 1.0 ? 0.999999 : x;
        y = y <= 0.0 ? 0.000001 : y;
        x = x <= 0.0 ? 0.000001 : x;
        if (x <= 1 - y) {
            return 1.0 - ((x * (1 - x)) / (y * (1.0 - y)));
        }
        else {
            return ((y * (1.0 - y)) / (x * (1 - x))) - 1.0;
        }
    };
    TreeStatistics.prototype.getBDoublePrime = function () {
        var x = this.getFalseAlarmsProbability();
        var y = this.getHitsProbability();
        return ((y * (1 - y)) - (x * (1 - x))) / ((y * (1 - y)) + (x * (1 - x)));
    };
    TreeStatistics.prototype.getIsosensitivityCurve = function () {
        var list = [];
        var aprime = this.getAPrime();
        for (var x = 0.0; x <= 1.0; x += 0.005) {
            var k = 3 - (4 * (x + (aprime * (1.0 - x))));
            var y = Math.sqrt((x * (1 - x)) + Math.pow((k / 2.0), 2.0)) - (k / 2);
            y = y < 0 ? 0 : y;
            y = y > 1 ? 1 : y;
            var tuple = { first: x, second: y };
            list.push(tuple);
        }
        return list;
    };
    TreeStatistics.prototype.getIsoBiasCurve = function (ref /*{switchOrientation:false}*/) {
        var list = [];
        var bprime = this.getBPrime();
        for (var x = 0.0; x <= 1.0; x += 0.005) {
            var nom = (x * (1.0 - x));
            var den = (1 - bprime);
            var div = 0.0;
            var sqc = 0.0;
            if (nom != 0.0 && den != 0.0) {
                div = nom / den;
            }
            sqc = 0.25 - div;
            if (sqc < 0.0) {
                ref.switchOrientation = true;
                continue;
            }
            var sqrt = Math.sqrt(sqc);
            var y1 = 0.5 + sqrt;
            y1 = y1 < 0 ? 0 : y1;
            y1 = y1 > 1 ? 1 : y1;
            var y2 = 0.5 - sqrt;
            y2 = y2 < 0 ? 0 : y2;
            y2 = y2 > 1 ? 1 : y2;
            var tp1 = { first: x, second: y1 };
            var tp2 = { first: x, second: y2 };
            list.push(tp1);
            list.push(tp2);
        }
    };
    return TreeStatistics;
})();
//# sourceMappingURL=fftreeStatistics.js.map