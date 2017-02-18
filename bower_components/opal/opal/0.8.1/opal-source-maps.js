/* Generated by Opal 0.8.1 */
Opal.modules["json"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $hash2 = Opal.hash2, $klass = Opal.klass;

  Opal.add_stubs(['$new', '$push', '$[]=', '$[]', '$create_id', '$json_create', '$attr_accessor', '$create_id=', '$===', '$parse', '$generate', '$from_object', '$to_json', '$responds_to?', '$to_io', '$write', '$to_s', '$to_a', '$strftime']);
  (function($base) {
    var self = $module($base, 'JSON');

    var def = self.$$proto, $scope = self.$$scope, $a, $b;

    
    var $parse  = JSON.parse,
        $hasOwn = Opal.hasOwnProperty;

    function to_opal(value, options) {
      switch (typeof value) {
        case 'string':
          return value;

        case 'number':
          return value;

        case 'boolean':
          return !!value;

        case 'null':
          return nil;

        case 'object':
          if (!value) return nil;

          if (value.$$is_array) {
            var arr = (options.array_class).$new();

            for (var i = 0, ii = value.length; i < ii; i++) {
              (arr).$push(to_opal(value[i], options));
            }

            return arr;
          }
          else {
            var hash = (options.object_class).$new();

            for (var k in value) {
              if ($hasOwn.call(value, k)) {
                (hash)['$[]='](k, to_opal(value[k], options));
              }
            }

            var klass;
            if ((klass = (hash)['$[]']($scope.get('JSON').$create_id())) != nil) {
              klass = Opal.cget(klass);
              return (klass).$json_create(hash);
            }
            else {
              return hash;
            }
          }
      }
    };
  

    (function(self) {
      var $scope = self.$$scope, def = self.$$proto;

      return self.$attr_accessor("create_id")
    })(self.$singleton_class());

    (($a = ["json_class"]), $b = self, $b['$create_id='].apply($b, $a), $a[$a.length-1]);

    Opal.defs(self, '$[]', function(value, options) {
      var $a, self = this;

      if (options == null) {
        options = $hash2([], {})
      }
      if ((($a = $scope.get('String')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
        return self.$parse(value, options)
        } else {
        return self.$generate(value, options)
      };
    });

    Opal.defs(self, '$parse', function(source, options) {
      var self = this;

      if (options == null) {
        options = $hash2([], {})
      }
      return self.$from_object($parse(source), options);
    });

    Opal.defs(self, '$parse!', function(source, options) {
      var self = this;

      if (options == null) {
        options = $hash2([], {})
      }
      return self.$parse(source, options);
    });

    Opal.defs(self, '$from_object', function(js_object, options) {
      var $a, $b, $c, self = this;

      if (options == null) {
        options = $hash2([], {})
      }
      ($a = "object_class", $b = options, ((($c = $b['$[]']($a)) !== false && $c !== nil) ? $c : $b['$[]=']($a, $scope.get('Hash'))));
      ($a = "array_class", $b = options, ((($c = $b['$[]']($a)) !== false && $c !== nil) ? $c : $b['$[]=']($a, $scope.get('Array'))));
      return to_opal(js_object, options.smap);
    });

    Opal.defs(self, '$generate', function(obj, options) {
      var self = this;

      if (options == null) {
        options = $hash2([], {})
      }
      return obj.$to_json(options);
    });

    Opal.defs(self, '$dump', function(obj, io, limit) {
      var $a, self = this, string = nil;

      if (io == null) {
        io = nil
      }
      if (limit == null) {
        limit = nil
      }
      string = self.$generate(obj);
      if (io !== false && io !== nil) {
        if ((($a = io['$responds_to?']("to_io")) !== nil && (!$a.$$is_boolean || $a == true))) {
          io = io.$to_io()};
        io.$write(string);
        return io;
        } else {
        return string
      };
    });
  })(self);
  (function($base, $super) {
    function $Object(){};
    var self = $Object = $klass($base, $super, 'Object', $Object);

    var def = self.$$proto, $scope = self.$$scope;

    return (Opal.defn(self, '$to_json', function() {
      var self = this;

      return self.$to_s().$to_json();
    }), nil) && 'to_json'
  })(self, null);
  (function($base) {
    var self = $module($base, 'Enumerable');

    var def = self.$$proto, $scope = self.$$scope;

    Opal.defn(self, '$to_json', function() {
      var self = this;

      return self.$to_a().$to_json();
    })
  })(self);
  (function($base, $super) {
    function $Array(){};
    var self = $Array = $klass($base, $super, 'Array', $Array);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      
      var result = [];

      for (var i = 0, length = self.length; i < length; i++) {
        result.push((self[i]).$to_json());
      }

      return '[' + result.join(', ') + ']';
    
    }, nil) && 'to_json'
  })(self, null);
  (function($base, $super) {
    function $Boolean(){};
    var self = $Boolean = $klass($base, $super, 'Boolean', $Boolean);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      return (self == true) ? 'true' : 'false';
    }, nil) && 'to_json'
  })(self, null);
  (function($base, $super) {
    function $Hash(){};
    var self = $Hash = $klass($base, $super, 'Hash', $Hash);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      
      var inspect = [],
          keys = self.keys,
          _map = self.map,
          smap = self.smap,
          map, khash;

      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];

        if (key.$$is_string) {
          map = smap;
          khash = key;
        } else {
          map = _map;
          khash = key.$hash();
        }

        inspect.push((key).$to_s().$to_json() + ':' + (map[khash]).$to_json());
      }

      return '{' + inspect.join(', ') + '}';
    ;
    }, nil) && 'to_json'
  })(self, null);
  (function($base, $super) {
    function $NilClass(){};
    var self = $NilClass = $klass($base, $super, 'NilClass', $NilClass);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      return "null";
    }, nil) && 'to_json'
  })(self, null);
  (function($base, $super) {
    function $Numeric(){};
    var self = $Numeric = $klass($base, $super, 'Numeric', $Numeric);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      return self.toString();
    }, nil) && 'to_json'
  })(self, null);
  (function($base, $super) {
    function $String(){};
    var self = $String = $klass($base, $super, 'String', $String);

    var def = self.$$proto, $scope = self.$$scope;

    return Opal.defn(self, '$to_json', def.$inspect)
  })(self, null);
  (function($base, $super) {
    function $Time(){};
    var self = $Time = $klass($base, $super, 'Time', $Time);

    var def = self.$$proto, $scope = self.$$scope;

    return (def.$to_json = function() {
      var self = this;

      return self.$strftime("%FT%T%z").$to_json();
    }, nil) && 'to_json'
  })(self, null);
  return (function($base, $super) {
    function $Date(){};
    var self = $Date = $klass($base, $super, 'Date', $Date);

    var def = self.$$proto, $scope = self.$$scope;

    def.$to_json = function() {
      var self = this;

      return self.$to_s().$to_json();
    };

    return (def.$as_json = function() {
      var self = this;

      return self.$to_s();
    }, nil) && 'as_json';
  })(self, null);
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map/offset"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass;

  Opal.add_stubs(['$include', '$first', '$===', '$attr_reader', '$new', '$line', '$column', '$raise', '$class', '$zero?', '$==']);
  return (function($base) {
    var self = $module($base, 'SourceMap');

    var def = self.$$proto, $scope = self.$$scope;

    (function($base, $super) {
      function $Offset(){};
      var self = $Offset = $klass($base, $super, 'Offset', $Offset);

      var def = self.$$proto, $scope = self.$$scope, TMP_1;

      self.$include($scope.get('Comparable'));

      Opal.defs(self, '$new', TMP_1 = function(args) {
        var self = this, $iter = TMP_1.$$p, $yield = $iter || nil, $case = nil;

        args = $slice.call(arguments, 0);
        TMP_1.$$p = null;
        return (function() {$case = args.$first();if ($scope.get('Offset')['$===']($case)) {return args.$first()}else if ($scope.get('Array')['$===']($case)) {return Opal.find_super_dispatcher(self, 'new', TMP_1, null, $Offset).apply(self, [].concat(args.$first()))}else {return Opal.find_super_dispatcher(self, 'new', TMP_1, null, $Offset).apply(self, [].concat(args))}})();
      });

      def.$initialize = function(line, column) {
        var $a, self = this;

        return $a = [line, column], self.line = $a[0], self.column = $a[1];
      };

      self.$attr_reader("line");

      self.$attr_reader("column");

      def['$+'] = function(other) {
        var self = this, $case = nil;

        return (function() {$case = other;if ($scope.get('Offset')['$===']($case)) {return $scope.get('Offset').$new($rb_plus(self.$line(), other.$line()), $rb_plus(self.$column(), other.$column()))}else if ($scope.get('Integer')['$===']($case)) {return $scope.get('Offset').$new($rb_plus(self.$line(), other), self.$column())}else {return self.$raise($scope.get('ArgumentError'), "can't convert " + (other) + " into " + (self.$class()))}})();
      };

      def['$<=>'] = function(other) {
        var $a, self = this, $case = nil, diff = nil;

        return (function() {$case = other;if ($scope.get('Offset')['$===']($case)) {diff = $rb_minus(self.$line(), other.$line());
        if ((($a = diff['$zero?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
          return $rb_minus(self.$column(), other.$column())
          } else {
          return diff
        };}else {return self.$raise($scope.get('ArgumentError'), "can't convert " + (other.$class()) + " into " + (self.$class()))}})();
      };

      def.$to_s = function() {
        var self = this;

        if (self.$column()['$=='](0)) {
          return "" + (self.$line())
          } else {
          return "" + (self.$line()) + ":" + (self.$column())
        };
      };

      return (def.$inspect = function() {
        var self = this;

        return "#<" + (self.$class()) + " line=" + (self.$line()) + ", column=" + (self.$column()) + ">";
      }, nil) && 'inspect';
    })(self, null)
  })(self)
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map/mapping"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass;

  Opal.add_stubs(['$require', '$line', '$generated', '$column', '$<<', '$source', '$original', '$name', '$class', '$inspect', '$new']);
  self.$require("source_map/offset");
  return (function($base) {
    var self = $module($base, 'SourceMap');

    var def = self.$$proto, $scope = self.$$scope;

    (function($base, $super) {
      function $Mapping(){};
      var self = $Mapping = $klass($base, $super, 'Mapping', $Mapping);

      var def = self.$$proto, $scope = self.$$scope;

      def.$to_s = function() {
        var $a, self = this, str = nil;

        str = "" + (self.$generated().$line()) + ":" + (self.$generated().$column());
        str['$<<']("->" + (self.$source()) + "@" + (self.$original().$line()) + ":" + (self.$original().$column()));
        if ((($a = self.$name()) !== nil && (!$a.$$is_boolean || $a == true))) {
          str['$<<']("#" + (self.$name()))};
        return str;
      };

      return (def.$inspect = function() {
        var $a, self = this, str = nil;

        str = "#<" + (self.$class()) + " source=" + (self.$source().$inspect());
        str['$<<'](" generated=" + (self.$generated()) + ", original=" + (self.$original()));
        if ((($a = self.$name()) !== nil && (!$a.$$is_boolean || $a == true))) {
          str['$<<'](" name=" + (self.$name().$inspect()))};
        str['$<<'](">");
        return str;
      }, nil) && 'inspect';
    })(self, $scope.get('Struct').$new("source", "generated", "original", "name"))
  })(self);
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map/vlq"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $range = Opal.range, $hash2 = Opal.hash2;

  Opal.add_stubs(['$<<', '$split', '$inject', '$[]=', '$[]', '$each', '$-@', '$&', '$>>', '$|', '$join', '$any?', '$shift', '$raise', '$==', '$map', '$encode', '$each_with_index', '$decode']);
  return (function($base) {
    var self = $module($base, 'SourceMap');

    var def = self.$$proto, $scope = self.$$scope;

    (function($base) {
      var self = $module($base, 'VLQ');

      var def = self.$$proto, $scope = self.$$scope, $a, $b, TMP_1;

      Opal.cdecl($scope, 'VLQ_BASE_SHIFT', 5);

      Opal.cdecl($scope, 'VLQ_BASE', (1)['$<<']($scope.get('VLQ_BASE_SHIFT')));

      Opal.cdecl($scope, 'VLQ_BASE_MASK', $rb_minus($scope.get('VLQ_BASE'), 1));

      Opal.cdecl($scope, 'VLQ_CONTINUATION_BIT', $scope.get('VLQ_BASE'));

      Opal.cdecl($scope, 'BASE64_DIGITS', "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".$split(""));

      Opal.cdecl($scope, 'BASE64_VALUES', ($a = ($b = ($range(0, 64, true))).$inject, $a.$$p = (TMP_1 = function(h, i){var self = TMP_1.$$s || this;
if (h == null) h = nil;if (i == null) i = nil;
      h['$[]=']($scope.get('BASE64_DIGITS')['$[]'](i), i);
        return h;}, TMP_1.$$s = self, TMP_1), $a).call($b, $hash2([], {})));

      Opal.defs(self, '$encode', function(ary) {
        var $a, $b, TMP_2, self = this, result = nil;

        result = [];
        ($a = ($b = ary).$each, $a.$$p = (TMP_2 = function(n){var self = TMP_2.$$s || this, $a, vlq = nil, digit = nil;
if (n == null) n = nil;
        vlq = (function() {if ($rb_lt(n, 0)) {
            return $rb_plus(((n['$-@']())['$<<'](1)), 1)
            } else {
            return n['$<<'](1)
          }; return nil; })();
          while ($rb_gt(vlq, 0)) {
          digit = vlq['$&']($scope.get('VLQ_BASE_MASK'));
          vlq = vlq['$>>']($scope.get('VLQ_BASE_SHIFT'));
          if ($rb_gt(vlq, 0)) {
            digit = digit['$|']($scope.get('VLQ_CONTINUATION_BIT'))};
          result['$<<']($scope.get('BASE64_DIGITS')['$[]'](digit));};}, TMP_2.$$s = self, TMP_2), $a).call($b);
        return result.$join();
      });

      Opal.defs(self, '$decode', function(str) {
        var $a, $b, self = this, result = nil, chars = nil, vlq = nil, shift = nil, continuation = nil, char$ = nil, digit = nil;

        result = [];
        chars = str.$split("");
        while ((($b = chars['$any?']()) !== nil && (!$b.$$is_boolean || $b == true))) {
        vlq = 0;
        shift = 0;
        continuation = true;
        while (continuation !== false && continuation !== nil) {
        char$ = chars.$shift();
        if (char$ !== false && char$ !== nil) {
          } else {
          self.$raise($scope.get('ArgumentError'))
        };
        digit = $scope.get('BASE64_VALUES')['$[]'](char$);
        if ((digit['$&']($scope.get('VLQ_CONTINUATION_BIT')))['$=='](0)) {
          continuation = false};
        digit = digit['$&']($scope.get('VLQ_BASE_MASK'));
        vlq = $rb_plus(vlq, digit['$<<'](shift));
        shift = $rb_plus(shift, $scope.get('VLQ_BASE_SHIFT'));};
        result['$<<'](((function() {if (vlq['$&'](1)['$=='](1)) {
          return (vlq['$>>'](1))['$-@']()
          } else {
          return vlq['$>>'](1)
        }; return nil; })()));};
        return result;
      });

      Opal.defs(self, '$encode_mappings', function(ary) {
        var $a, $b, TMP_3, self = this;

        return ($a = ($b = ary).$map, $a.$$p = (TMP_3 = function(group){var self = TMP_3.$$s || this, $a, $b, TMP_4;
if (group == null) group = nil;
        return ($a = ($b = group).$map, $a.$$p = (TMP_4 = function(segment){var self = TMP_4.$$s || this;
if (segment == null) segment = nil;
          return self.$encode(segment)}, TMP_4.$$s = self, TMP_4), $a).call($b).$join(",")}, TMP_3.$$s = self, TMP_3), $a).call($b).$join(";");
      });

      Opal.defs(self, '$decode_mappings', function(str) {
        var $a, $b, TMP_5, self = this, mappings = nil;

        mappings = [];
        ($a = ($b = str.$split(";")).$each_with_index, $a.$$p = (TMP_5 = function(group, index){var self = TMP_5.$$s || this, $a, $b, TMP_6;
if (group == null) group = nil;if (index == null) index = nil;
        mappings['$[]='](index, []);
          return ($a = ($b = group.$split(",")).$each, $a.$$p = (TMP_6 = function(segment){var self = TMP_6.$$s || this;
if (segment == null) segment = nil;
          return mappings['$[]'](index)['$<<'](self.$decode(segment))}, TMP_6.$$s = self, TMP_6), $a).call($b);}, TMP_5.$$s = self, TMP_5), $a).call($b);
        return mappings;
      });
    })(self)
  })(self)
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map/map"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass, $hash2 = Opal.hash2, $range = Opal.range;

  Opal.add_stubs(['$require', '$include', '$from_hash', '$parse', '$[]', '$decode_vlq_mappings', '$new', '$each_with_index', '$each', '$size', '$<<', '$decode_mappings', '$attr_reader', '$to_proc', '$build_vlq_string', '$compact', '$uniq', '$map', '$eql?', '$is_a?', '$class', '$==', '$mappings', '$filename', '$dup', '$any?', '$line', '$generated', '$last', '$source', '$original', '$name', '$empty?', '$bsearch', '$to_s', '$sources', '$names', '$inspect', '$protected', '$group_by', '$to_a', '$column', '$max', '$keys', '$encode_mappings']);
  self.$require("json");
  self.$require("source_map/offset");
  self.$require("source_map/mapping");
  self.$require("source_map/vlq");
  return (function($base) {
    var self = $module($base, 'SourceMap');

    var def = self.$$proto, $scope = self.$$scope;

    (function($base, $super) {
      function $Map(){};
      var self = $Map = $klass($base, $super, 'Map', $Map);

      var def = self.$$proto, $scope = self.$$scope, TMP_3;

      def.mappings = def.string = def.sources = def.names = nil;
      self.$include($scope.get('Enumerable'));

      Opal.defs(self, '$from_json', function(json) {
        var self = this;

        return self.$from_hash($scope.get('JSON').$parse(json));
      });

      Opal.defs(self, '$from_hash', function(hash) {
        var self = this, str = nil, sources = nil, names = nil, mappings = nil;

        str = hash['$[]']("mappings");
        sources = hash['$[]']("sources");
        names = hash['$[]']("names");
        mappings = self.$decode_vlq_mappings(str, sources, names);
        return self.$new(mappings, hash['$[]']("file"));
      });

      Opal.defs(self, '$decode_vlq_mappings', function(str, sources, names) {
        var $a, $b, TMP_1, self = this, mappings = nil, source_id = nil, original_line = nil, original_column = nil, name_id = nil;

        if (sources == null) {
          sources = []
        }
        if (names == null) {
          names = []
        }
        mappings = [];
        source_id = 0;
        original_line = 1;
        original_column = 0;
        name_id = 0;
        ($a = ($b = $scope.get('VLQ').$decode_mappings(str)).$each_with_index, $a.$$p = (TMP_1 = function(group, index){var self = TMP_1.$$s || this, $a, $b, TMP_2, generated_column = nil, generated_line = nil;
if (group == null) group = nil;if (index == null) index = nil;
        generated_column = 0;
          generated_line = $rb_plus(index, 1);
          return ($a = ($b = group).$each, $a.$$p = (TMP_2 = function(segment){var self = TMP_2.$$s || this, $a, generated = nil, source = nil, original = nil, name = nil;
if (segment == null) segment = nil;
          generated_column = $rb_plus(generated_column, segment['$[]'](0));
            generated = $scope.get('Offset').$new(generated_line, generated_column);
            if ($rb_ge(segment.$size(), 4)) {
              source_id = $rb_plus(source_id, segment['$[]'](1));
              original_line = $rb_plus(original_line, segment['$[]'](2));
              original_column = $rb_plus(original_column, segment['$[]'](3));
              source = sources['$[]'](source_id);
              original = $scope.get('Offset').$new(original_line, original_column);
              } else {
              return nil;
            };
            if ((($a = segment['$[]'](4)) !== nil && (!$a.$$is_boolean || $a == true))) {
              name_id = $rb_plus(name_id, segment['$[]'](4));
              name = names['$[]'](name_id);};
            return mappings['$<<']($scope.get('Mapping').$new(source, generated, original, name));}, TMP_2.$$s = self, TMP_2), $a).call($b);}, TMP_1.$$s = self, TMP_1), $a).call($b);
        return mappings;
      });

      def.$initialize = function(mappings, filename) {
        var $a, self = this;

        if (mappings == null) {
          mappings = []
        }
        if (filename == null) {
          filename = nil
        }
        return $a = [mappings, filename], self.mappings = $a[0], self.filename = $a[1];
      };

      self.$attr_reader("filename");

      def.$size = function() {
        var self = this;

        return self.mappings.$size();
      };

      def['$[]'] = function(i) {
        var self = this;

        return self.mappings['$[]'](i);
      };

      def.$each = TMP_3 = function() {
        var $a, $b, self = this, $iter = TMP_3.$$p, block = $iter || nil;

        TMP_3.$$p = null;
        return ($a = ($b = self.mappings).$each, $a.$$p = block.$to_proc(), $a).call($b);
      };

      def.$to_s = function() {
        var $a, self = this;

        return ((($a = self.string) !== false && $a !== nil) ? $a : self.string = self.$build_vlq_string());
      };

      def.$sources = function() {
        var $a, $b, $c, self = this;

        return ((($a = self.sources) !== false && $a !== nil) ? $a : self.sources = ($b = ($c = self.mappings).$map, $b.$$p = "source".$to_proc(), $b).call($c).$uniq().$compact());
      };

      def.$names = function() {
        var $a, $b, $c, self = this;

        return ((($a = self.names) !== false && $a !== nil) ? $a : self.names = ($b = ($c = self.mappings).$map, $b.$$p = "name".$to_proc(), $b).call($c).$uniq().$compact());
      };

      def['$=='] = function(other) {
        var self = this;

        return self['$eql?'](other);
      };

      def['$eql?'] = function(other) {
        var $a, $b, self = this;

        return ($a = ($b = other['$is_a?'](self.$class()), $b !== false && $b !== nil ?self.$mappings()['$=='](other.$mappings()) : $b), $a !== false && $a !== nil ?self.$filename()['$=='](other.$filename()) : $a);
      };

      def['$+'] = function(other) {
        var $a, $b, TMP_4, self = this, mappings = nil, offset = nil;

        mappings = self.mappings.$dup();
        offset = (function() {if ((($a = self.mappings['$any?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
          return $rb_plus(self.mappings.$last().$generated().$line(), 1)
          } else {
          return 0
        }; return nil; })();
        ($a = ($b = other).$each, $a.$$p = (TMP_4 = function(m){var self = TMP_4.$$s || this;
if (m == null) m = nil;
        return mappings['$<<']($scope.get('Mapping').$new(m.$source(), $rb_plus(m.$generated(), offset), m.$original(), m.$name()))}, TMP_4.$$s = self, TMP_4), $a).call($b);
        return self.$class().$new(mappings, other.$filename());
      };

      def['$|'] = function(other) {
        var $a, $b, TMP_5, self = this, mappings = nil;

        if ((($a = self.$mappings()['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
          return other.$dup()};
        mappings = [];
        ($a = ($b = other).$each, $a.$$p = (TMP_5 = function(m){var self = TMP_5.$$s || this, om = nil;
if (m == null) m = nil;
        om = self.$bsearch(m.$original());
          if (om !== false && om !== nil) {
            } else {
            return nil;
          };
          return mappings['$<<']($scope.get('Mapping').$new(om.$source(), m.$generated(), om.$original(), om.$name()));}, TMP_5.$$s = self, TMP_5), $a).call($b);
        return self.$class().$new(mappings, other.$filename());
      };

      def.$bsearch = function(offset, from, to) {
        var self = this, mid = nil;

        if (from == null) {
          from = 0
        }
        if (to == null) {
          to = $rb_minus(self.$size(), 1)
        }
        mid = $rb_divide(($rb_plus(from, to)), 2);
        if ($rb_gt(from, to)) {
          return (function() {if ($rb_lt(from, 1)) {
            return nil
            } else {
            return self['$[]']($rb_minus(from, 1))
          }; return nil; })()};
        if (offset['$=='](self['$[]'](mid).$generated())) {
          return self['$[]'](mid)
        } else if ($rb_lt(offset, self['$[]'](mid).$generated())) {
          return self.$bsearch(offset, from, $rb_minus(mid, 1))
        } else if ($rb_gt(offset, self['$[]'](mid).$generated())) {
          return self.$bsearch(offset, $rb_plus(mid, 1), to)
          } else {
          return nil
        };
      };

      def.$as_json = function() {
        var self = this;

        return $hash2(["version", "file", "mappings", "sources", "names"], {"version": 3, "file": self.$filename(), "mappings": self.$to_s(), "sources": self.$sources(), "names": self.$names()});
      };

      def.$inspect = function() {
        var $a, $b, self = this, str = nil;

        str = "#<" + (self.$class());
        if ((($a = self.$filename()) !== nil && (!$a.$$is_boolean || $a == true))) {
          str['$<<'](" filename=" + (self.$filename().$inspect()))};
        if ((($a = self.$mappings()['$any?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
          str['$<<'](" mappings=" + (($a = ($b = self.$mappings()).$map, $a.$$p = "to_s".$to_proc(), $a).call($b).$inspect()))};
        str['$<<'](">");
        return str;
      };

      self.$protected();

      self.$attr_reader("mappings");

      return (def.$build_vlq_string = function() {
        var $a, $b, TMP_6, $c, TMP_7, $d, self = this, source_id = nil, source_line = nil, source_column = nil, name_id = nil, by_lines = nil, sources_index = nil, names_index = nil, ary = nil;

        source_id = 0;
        source_line = 1;
        source_column = 0;
        name_id = 0;
        by_lines = ($a = ($b = self.mappings).$group_by, $a.$$p = (TMP_6 = function(m){var self = TMP_6.$$s || this;
if (m == null) m = nil;
        return m.$generated().$line()}, TMP_6.$$s = self, TMP_6), $a).call($b);
        sources_index = $scope.get('Hash')['$[]'](self.$sources().$each_with_index().$to_a());
        names_index = $scope.get('Hash')['$[]'](self.$names().$each_with_index().$to_a());
        ary = ($a = ($c = ($range(1, (((($d = by_lines.$keys().$max()) !== false && $d !== nil) ? $d : 1)), false))).$map, $a.$$p = (TMP_7 = function(line){var self = TMP_7.$$s || this, $a, $b, TMP_8, $c, generated_column = nil;
if (line == null) line = nil;
        generated_column = 0;
          return ($a = ($b = (((($c = by_lines['$[]'](line)) !== false && $c !== nil) ? $c : []))).$map, $a.$$p = (TMP_8 = function(mapping){var self = TMP_8.$$s || this, $a, group = nil;
if (mapping == null) mapping = nil;
          group = [];
            group['$<<']($rb_minus(mapping.$generated().$column(), generated_column));
            group['$<<']($rb_minus(sources_index['$[]'](mapping.$source()), source_id));
            group['$<<']($rb_minus(mapping.$original().$line(), source_line));
            group['$<<']($rb_minus(mapping.$original().$column(), source_column));
            if ((($a = mapping.$name()) !== nil && (!$a.$$is_boolean || $a == true))) {
              group['$<<']($rb_minus(names_index['$[]'](mapping.$name()), name_id))};
            generated_column = mapping.$generated().$column();
            source_id = sources_index['$[]'](mapping.$source());
            source_line = mapping.$original().$line();
            source_column = mapping.$original().$column();
            if ((($a = mapping.$name()) !== nil && (!$a.$$is_boolean || $a == true))) {
              name_id = names_index['$[]'](mapping.$name())};
            return group;}, TMP_8.$$s = self, TMP_8), $a).call($b);}, TMP_7.$$s = self, TMP_7), $a).call($c);
        return $scope.get('VLQ').$encode_mappings(ary);
      }, nil) && 'build_vlq_string';
    })(self, null)
  })(self);
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map/version"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;

  return (function($base) {
    var self = $module($base, 'SourceMap');

    var def = self.$$proto, $scope = self.$$scope;

    Opal.cdecl($scope, 'VERSION', "0.0.2")
  })(self)
};
/* Generated by Opal 0.8.1 */
Opal.modules["source_map"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$require']);
  self.$require("source_map/map");
  self.$require("source_map/mapping");
  self.$require("source_map/offset");
  self.$require("source_map/version");
  return self.$require("source_map/vlq");
};
/* Generated by Opal 0.8.1 */
Opal.modules["opal/source_map"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass;

  Opal.add_stubs(['$require', '$attr_reader', '$file', '$map', '$line', '$column', '$code', '$new', '$count', '$size', '$rindex', '$any?', '$compact', '$as_json', '$to_s']);
  self.$require("source_map");
  return (function($base) {
    var self = $module($base, 'Opal');

    var def = self.$$proto, $scope = self.$$scope;

    (function($base, $super) {
      function $SourceMap(){};
      var self = $SourceMap = $klass($base, $super, 'SourceMap', $SourceMap);

      var def = self.$$proto, $scope = self.$$scope;

      def.map = def.fragments = nil;
      self.$attr_reader("fragments");

      self.$attr_reader("file");

      def.$initialize = function(fragments, file) {
        var self = this;

        self.fragments = fragments;
        return self.file = file;
      };

      def.$map = function() {
        var $a, $b, $c, TMP_1, self = this, source_file = nil, generated_line = nil, generated_column = nil, mappings = nil, zero_offset = nil;

        return ((($a = self.map) !== false && $a !== nil) ? $a : self.map = (function() {source_file = $rb_plus(self.$file(), ".rb");
        $b = [1, 0], generated_line = $b[0], generated_column = $b[1];
        mappings = ($b = ($c = self.fragments).$map, $b.$$p = (TMP_1 = function(fragment){var self = TMP_1.$$s || this, $a, $b, mapping = nil, source_line = nil, source_column = nil, source_code = nil, source_offset = nil, generated_offset = nil, new_lines = nil;
if (fragment == null) fragment = nil;
        mapping = nil;
          source_line = fragment.$line();
          source_column = fragment.$column();
          source_code = fragment.$code();
          if ((($a = (($b = source_line !== false && source_line !== nil) ? source_column : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
            source_offset = ((Opal.get('SourceMap')).$$scope.get('Offset')).$new(source_line, source_column);
            generated_offset = ((Opal.get('SourceMap')).$$scope.get('Offset')).$new(generated_line, generated_column);
            mapping = ((Opal.get('SourceMap')).$$scope.get('Mapping')).$new(source_file, generated_offset, source_offset);};
          new_lines = source_code.$count("\n");
          generated_line = $rb_plus(generated_line, new_lines);
          if ($rb_gt(new_lines, 0)) {
            generated_column = $rb_minus(source_code.$size(), ($rb_plus(source_code.$rindex("\n"), 1)))
            } else {
            generated_column = $rb_plus(generated_column, source_code.$size())
          };
          return mapping;}, TMP_1.$$s = self, TMP_1), $b).call($c);
        if ((($b = mappings['$any?']()) !== nil && (!$b.$$is_boolean || $b == true))) {
          } else {
          zero_offset = ((Opal.get('SourceMap')).$$scope.get('Offset')).$new(0, 0);
          mappings = [((Opal.get('SourceMap')).$$scope.get('Mapping')).$new(source_file, zero_offset, zero_offset)];
        };
        return ((Opal.get('SourceMap')).$$scope.get('Map')).$new(mappings.$compact());})());
      };

      def.$as_json = function() {
        var self = this;

        return self.$map().$as_json();
      };

      def.$to_s = function() {
        var self = this;

        return self.$map().$to_s();
      };

      return (def.$magic_comment = function(map_path) {
        var self = this;

        return "\n//# sourceMappingURL=file://" + (map_path);
      }, nil) && 'magic_comment';
    })(self, null)
  })(self);
};
/* Generated by Opal 0.8.1 */
Opal.modules["opal-source-maps"] = function(Opal) {
  Opal.dynamic_require_severity = "warning";
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$require']);
  self.$require("source_map");
  return self.$require("opal/source_map");
};
