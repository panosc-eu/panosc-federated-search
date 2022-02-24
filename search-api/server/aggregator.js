module.exports = Aggregator;

function compareByScore(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}

function Sort(mergedResults) {
  return mergedResults.sort(compareByScore)
}

function Aggregator(results, method, callback, limit = -1) {
  //console.log('aggregator:Aggregator:results :' + results);
  //console.log('aggregator:Aggregator:method :' + method);

  if (method == 'count') {
    //console.log('aggregator:Aggregator count');
    let mergedResults = 0;
    for (let result of results) {
      if (result != null) {
        mergedResults += result;
      }
    }
    callback(null, mergedResults);
  } else if (method == 'statistics') {
    //console.log('aggregator:Aggregator statistics');
    var parameters = {};
    for (let result of results) {
      if (result != null) {
        for (let parameter of Object.keys(result)) {
          if (parameters[parameter] === undefined) {
            parameters[parameter] = result[parameter];
          } else {
            for (let value of result[parameter]) {
              var availableParameter = undefined;
              for (let statParameter of parameters[parameter]) {
                if (statParameter.value === value.value && statParameter.unit === value.unit) {
                  availableParameter = statParameter;
                }
              }
              if (availableParameter === undefined) {
                parameters[parameter].push(value);
              } else {
                availableParameter.count += value.count;
              }
            }
          }
        }
      }
    }
    callback(null, parameters);
  } else {
    //console.log('aggregator:Aggregator other 1');
    let mergedResults = new Array();
    for (let result of results) {
      console.log('aggregator:Aggregator - Provider : ' + result[0].provider);
      console.log('aggregator:Aggregator - Number of results : ' + result.length);
      if (result != null) {
        mergedResults = mergedResults.concat(result);
      }
    }
    if (method == 'findById') {
      //console.log('aggregator:Aggregator findById');
      if (mergedResults.length > 0) {
        callback(null, mergedResults[0]);
      } else {
        callback(null, null);
      }
    } else {
      //console.log('aggregator:Aggregator other 2');
      mergedResults = Sort(mergedResults);
      callback(null, (limit > 0 ? mergedResults.slice(0, limit) : mergedResults));
    }
  }
}
