import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { poison as poisonImages } from 'assets';

const colors = ['none', 'blue', 'red', 'yellow'];

const findDamage = (damageDealt) => {
  const damages = [7500, 15000, 30000];
  const result = { double: 0, single: 0, remainder: 0 };
  damages.forEach((damage) => {
    damages.filter(d => d !== damage).forEach((d) => {
      if ((damageDealt - (damage * 2)) - d === 0) {
        result.double = damage;
        result.single = d;
        result.remainder = damages.filter(d2 => ![d, damage].includes(d2)).pop();
      }
    });
  });
  return result;
};

/* eslint-disable react/no-array-index-key */

const capital = string => `${string[0].toUpperCase()}${string.slice(1)}`;

export default class PoisonReader extends Component {
  constructor(props) {
    super(props);

    const poisons = JSON.parse(window.localStorage.getItem('poisons'));

    this.state = {
      health: null,
      poisons: poisons || [0, 0, 0],
      validCombination: (poisons || [0, 0, 0])
        .join('')
        .match(new RegExp('^(?!.*([1-3]).*\\1.*\\1.*\\1).*?([1-3]).*\\2', 'g')),
      damage: {
        none: '0',
        blue: '?',
        red: '?',
        yellow: '?',
      },
    };

    this.resetFrogs = this.resetFrogs.bind(this);
  }

  componentDidUpdate() {
    const { health } = this.state;
    const { matches } = this.props;
    const [name] = Object.keys(matches)
      .filter(key => matches[key] === true || matches[key].length > 0);
    const newHealth = (name && +name.slice(1));
    if (health === null && newHealth && newHealth === 90000) {
      this.setState({ health: newHealth });
    }
    if (health !== null && name && newHealth < health) {
      this.updateHealth(newHealth);
    }
  }

  updateHealth(newHealth) {
    const {
      health, validCombination, poisons, damage,
    } = this.state;
    const newDamage = damage;
    if (validCombination) {
      const { double, single, remainder } = findDamage(health - newHealth);
      [1, 2, 3].forEach((type) => {
        const i = Object.keys(damage)[type];
        if (!poisons.includes(type)) {
          newDamage[i] = remainder;
        } else if (poisons.join('').match(new RegExp(`${type}`, 'g')).length > 1) {
          newDamage[i] = double;
        } else {
          newDamage[i] = single;
        }
      });
    }
    this.setState({
      health: newHealth,
      damage: newDamage,
    });
  }

  updateColor(color, index) {
    const { poisons } = this.state;
    if (color < poisons.length) {
      poisons[index] = color + 1;
    } else poisons[index] = 0;

    window.localStorage.setItem('poisons', JSON.stringify(poisons));

    this.setState({
      poisons,
      validCombination: !['111', '222', '333'].includes(poisons.join(''))
      && !poisons.join('').includes('0')
      && poisons
        .join('')
        .match(new RegExp('^(?!.*([1-3]).*\\1.*\\1.*\\1).*?([1-3]).*\\2', 'g')),
    });
  }

  resetFrogs() {
    const { poisons } = this.state;
    this.setState({
      health: null,
      validCombination: poisons
        .join('')
        .match(new RegExp('^(?!.*([1-3]).*\\1.*\\1.*\\1).*?([1-3]).*\\2', 'g')),
      damage: {
        none: '0',
        blue: '?',
        red: '?',
        yellow: '?',
      },
    });
  }

  render() {
    const {
      poisons, validCombination, damage,
    } = this.state;

    const [defaultColor] = colors;

    return (
      <div className="wrapper__poisonReader">
        <FontAwesomeIcon
          className="icon__valid"
          icon={validCombination ? faCheck : faTimes}
          color={validCombination ? 'seagreen' : 'indianred'}
        />
        <div className="wrapper__poison">
          {poisons.map((color, index) => (
            <div key={index} className="wrapper__item">
              <span>{damage[Object.keys(damage)[color]].toLocaleString()}</span>
              <button className="item__poison" type="button" onClick={() => this.updateColor(color, index)}>
                {colors.map((c, i) => (
                  <img
                    src={poisonImages[c]}
                    style={{ display: color === i ? 'block' : 'none' }}
                    alt="poison"
                    draggable={false}
                    key={`${colors[color]}_${index}_${i}`}
                  />
                ))}
              </button>
              <span>{capital(colors[color] || defaultColor)}</span>
            </div>
          ))}
        </div>
        <div className="container__deadliest">
          <h3>Deadliest frog:</h3>
          <img
            src={poisonImages[colors[Object.values(damage).indexOf(30000)] || 'none']}
            alt="deadliest frog"
            draggable={false}
          />
        </div>
        <button className="nisbutton reset" type="button" onClick={this.resetFrogs}>Reset</button>
      </div>
    );
  }
}

PoisonReader.propTypes = {
  matches: PropTypes.shape(),
};

PoisonReader.defaultProps = {
  matches: {},
};
