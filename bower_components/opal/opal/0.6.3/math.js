/* Generated by Opal 0.6.3 */
(function($opal) {
  var self = $opal.top, $scope = $opal, nil = $opal.nil, $breaker = $opal.breaker, $slice = $opal.slice, $module = $opal.module, $klass = $opal.klass;

  $opal.add_stubs(['$===', '$raise', '$type_error', '$to_f', '$log', '$include']);
  return (function($base) {
    var self = $module($base, 'Math');

    var def = self._proto, $scope = self._scope, $a;

    (function($base, $super) {
      function $DomainError(){};
      var self = $DomainError = $klass($base, $super, 'DomainError', $DomainError);

      var def = self._proto, $scope = self._scope, TMP_1;

      return ($opal.defs(self, '$new', TMP_1 = function(method) {
        var self = this, $iter = TMP_1._p, $yield = $iter || nil;

        TMP_1._p = null;
        return $opal.find_super_dispatcher(self, 'new', TMP_1, null, $DomainError).apply(self, ["Numerical argument is out of domain - \"" + (method) + "\""]);
      }), nil) && 'new'
    })(self, $scope.StandardError);

    $opal.cdecl($scope, 'E', Math.E);

    $opal.cdecl($scope, 'PI', Math.PI);

    def.$acos = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      x = x.$to_f();

      if (x < -1 || x > 1) {
        self.$raise($scope.DomainError, "acos");
      }

      return Math.acos(x);
    ;
    };

    if ((($a = (typeof(Math.acosh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.acosh = function(x) {
        return Math.log(x + Math.sqrt(x * x - 1));
      }
    
    };

    def.$acosh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.acosh(x.$to_f());
    ;
    };

    def.$asin = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      x = x.$to_f();

      if (x < -1 || x > 1) {
        self.$raise($scope.DomainError, "asin");
      }

      return Math.asin(x);
    ;
    };

    if ((($a = (typeof(Math.asinh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.asinh = function(x) {
        return Math.log(x + Math.sqrt(x * x + 1))
      }
    ;
    };

    def.$asinh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.asinh(x.$to_f());
    ;
    };

    def.$atan = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.atan(x.$to_f());
    ;
    };

    def.$atan2 = function(x, y) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      if (!$scope.Numeric['$==='](y)) {
        self.$raise($scope.Opal.$type_error(y, $scope.Float));
      }

      return Math.atan2(x.$to_f(), y.$to_f());
    ;
    };

    if ((($a = (typeof(Math.atanh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.atanh = function(x) {
        return 0.5 * Math.log((1 + x) / (1 - x));
      }
    
    };

    def.$atanh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      x = x.$to_f();

      if (x < -1 || x > 1) {
        self.$raise($scope.DomainError, "atanh");
      }

      return Math.atanh(x);
    ;
    };

    def.$cbrt = function(x) {
      var self = this;

      return Math.cbrt(x);
    };

    def.$cos = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.cos(x.$to_f());
    ;
    };

    if ((($a = (typeof(Math.cosh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.cosh = function(x) {
        return (Math.exp(x) + Math.exp(-x)) / 2;
      }
    
    };

    def.$cosh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.cosh(x.$to_f());
    ;
    };

    def.$erf = function(x) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    def.$erfc = function(x) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    def.$exp = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.exp(x.$to_f());
    ;
    };

    def.$frexp = function(x) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    def.$gamma = function(x) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    if ((($a = (typeof(Math.hypot) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.hypot = function(x, y) {
        return Math.sqrt(x * x + y * y)
      }
    ;
    };

    def.$hypot = function(x, y) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      if (!$scope.Numeric['$==='](y)) {
        self.$raise($scope.Opal.$type_error(y, $scope.Float));
      }

      return Math.hypot(x.$to_f(), y.$to_f());
    ;
    };

    def.$ldexp = function(flt, int$) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    def.$lgamma = function(x) {
      var self = this;

      return self.$raise($scope.NotImplementedError);
    };

    def.$log = function(num, base, method) {
      var $a, self = this;

      if (base == null) {
        base = $scope.E
      }
      if (method == null) {
        method = nil
      }
      
      if (!$scope.Numeric['$==='](num)) {
        self.$raise($scope.Opal.$type_error(num, $scope.Float));
      }

      if (!$scope.Numeric['$==='](base)) {
        self.$raise($scope.Opal.$type_error(base, $scope.Float));
      }

      num  = num.$to_f();
      base = base.$to_f();

      if (num < 0) {
        self.$raise($scope.DomainError, ((($a = method) !== false && $a !== nil) ? $a : "log"));
      }

      num = Math.log(num);

      if (base != Math.E) {
        num /= Math.log(base);
      }

      return num
    ;
    };

    if ((($a = (typeof(Math.log10) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      def.$log10 = function(num) {
        var self = this;

        
        if (!$scope.Numeric['$==='](num)) {
          self.$raise($scope.Opal.$type_error(num, $scope.Float));
        }

        num = num.$to_f();

        if (num < 0) {
          self.$raise($scope.DomainError, "log2");
        }

        return Math.log10(num);
      ;
      }
      } else {
      def.$log10 = function(num) {
        var self = this;

        return self.$log(num, 10, "log10");
      }
    };

    if ((($a = (typeof(Math.log2) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      def.$log2 = function(num) {
        var self = this;

        
        if (!$scope.Numeric['$==='](num)) {
          self.$raise($scope.Opal.$type_error(num, $scope.Float));
        }

        num = num.$to_f();

        if (num < 0) {
          self.$raise($scope.DomainError, "log2");
        }

        return Math.log2(num);
      ;
      }
      } else {
      def.$log2 = function(num) {
        var self = this;

        return self.$log(num, 2, "log2");
      }
    };

    def.$sin = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.sin(x.$to_f());
    ;
    };

    if ((($a = (typeof(Math.sinh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.sinh = function(x) {
        return (Math.exp(x) - Math.exp(-x)) / 2;
      }
    
    };

    def.$sinh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.sinh(x.$to_f());
    ;
    };

    def.$sqrt = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      x = x.$to_f();

      if (x < 0) {
        self.$raise($scope.DomainError, "log2");
      }

      return Math.sqrt(x);
    ;
    };

    def.$tan = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.tan(x.$to_f());
    ;
    };

    if ((($a = (typeof(Math.tanh) !== "undefined")) !== nil && (!$a._isBoolean || $a == true))) {
      } else {
      
      Math.tanh = function(x) {
        if (x == Infinity) {
          return 1;
        }
        else if (x == -Infinity) {
          return -1;
        }
        else {
          return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
        }
      }
    
    };

    def.$tanh = function(x) {
      var self = this;

      
      if (!$scope.Numeric['$==='](x)) {
        self.$raise($scope.Opal.$type_error(x, $scope.Float));
      }

      return Math.tanh(x.$to_f());
    ;
    };

    (function(self) {
      var $scope = self._scope, def = self._proto;

      return self.$include($scope.Math)
    })(self.$singleton_class());
        ;$opal.donate(self, ["$acos", "$acosh", "$asin", "$asinh", "$atan", "$atan2", "$atanh", "$cbrt", "$cos", "$cosh", "$erf", "$erfc", "$exp", "$frexp", "$gamma", "$hypot", "$ldexp", "$lgamma", "$log", "$log10", "$log10", "$log2", "$log2", "$sin", "$sinh", "$sqrt", "$tan", "$tanh"]);
  })(self)
})(Opal);

//# sourceMappingURL=/__opal_source_maps__/math.js.map
;
