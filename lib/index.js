const Fund = require('./Fund').Fund;
const EventEmitter = require('events').EventEmitter;
require('console.table');

'use strict';

/**
 * 获取最新的数据
 * @param {*} value 
 */
function getLastValue(value) {
    let Expansion = value.Expansion;
    let Datas = value.Datas;

    if (!Datas) {
        return {
            name: 'unknow',
            value0: 'unknow',
            value1: 'unknow',
            value2: 'unknow',
            trend: 'unknow'
        };
    }

    let data = Datas[Datas.length - 1];
    let last_data = Datas.length >= 2 ? Datas[Datas.length - 2] : null;
    let last_last_data = Datas.length >= 3 ? Datas[Datas.length - 3] : null;
    if (data) {
        let list = data.split(',');
        let raw = list[list.length - 1];
        let _value = parseFloat(raw);
        
        let last_list = last_data ? last_data.split(',') : list;
        let _last_value = parseFloat(last_list[last_list.length - 1]);

        let last_last_list = last_last_data ? last_last_data.split(',') : list;
        let _last_last_value = parseFloat(last_last_list[last_last_list.length - 1]);

        let trend = ' ';
        let tr = ['→', '↗︎', '↘︎'];
        if (_last_last_value < _last_value) {
            trend += tr[1];
        } else if (_last_last_value > _last_value) {
            trend += tr[2];
        } else {
            trend += tr[0];
        }
        trend += ' ';
        if (_last_value < _value) {
            trend += tr[1];
        } else if (_last_value > _value) {
            trend += tr[2];
        } else {
            trend += tr[0];
        }

        return {
            name: Expansion.SHORTNAME,
            value0: _last_last_value,
            value1: _last_value,
            value2: _value,
            trend: trend
        };
    } else {
        return {
            name: Expansion.SHORTNAME,
            value0: '-------',
            value1: '-------',
            value2: '-------',
            trend: '  -'
        };
    }
}

module.exports = {
    run(fcodes, delay = 60000) {
        let fund = new Fund();
        let event = new EventEmitter();
        event.on('refresh', () => {
            console.clear();
            event.emit('next');
            console.time('net');
            fund.gets(fcodes)
                .then(results => {
                    let shows = [];
                    results.map(value => {
                        shows.push(getLastValue(value));
                    });
                    console.table(shows);
                    console.timeEnd('net');
                })
                .catch(error => {
                    console.log(error);
                    console.timeEnd('net');
                });
        });
        
        event.on('next', () => {
            setTimeout(function() {
                event.emit('refresh');
            }, delay);
        });
        
        event.emit('refresh');
    }
};