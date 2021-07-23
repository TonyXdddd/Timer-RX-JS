import React, { useState, useRef, useEffect } from 'react';
import { fromEvent, interval, take, } from 'rxjs';
import { map, timeInterval } from 'rxjs/operators';
import classNames from "classnames";
import styles from './Timer.module.scss';

export const Timer = () => {
  //STATE ENTITIES
  //Change the initial value for check. Max minutes value - 99min.
  const [reduced100Ms, setReduced100Ms] = useState(0);

  //STATUSES: 'Stop', 'Pause', 'Play'
  const [status, setStatus] = useState('Stop');

  //STREAMS ENTITIES
  const pauseButtonRef = useRef(null);
  const resetButtonRef = useRef(null);

  const onPlay = () => {
    setStatus('Play');
    const timer$ = interval(100)
      .pipe(map((value) => value + reduced100Ms))
      .subscribe(value => {
        setReduced100Ms(value);
      });

    const clicksOnPauseDetect$ = fromEvent(pauseButtonRef.current, 'click')
      .pipe(timeInterval())
      .subscribe(value => {
        if (value.interval <= 300) {
          setStatus('Pause');
          timer$.unsubscribe();
        }
      });

    fromEvent(resetButtonRef.current, 'click')
      .pipe(take(1))
      .subscribe(() => {
        setStatus('Stop');
        setReduced100Ms(0);
        timer$.unsubscribe();
        clicksOnPauseDetect$.unsubscribe();
      });
  };

  return (
    <div className={styles.timerWrapper}>
      <div className={styles.timerStatus}>{ status }</div>
      <div className={styles.scoreboard}>
        <div className={styles.score}>
          <div className={styles.number}>
            { Math.floor((reduced100Ms / 600) % 99) }
          </div>
        </div>
        <div className={styles.score}>
          <div className={styles.number}>
            { Math.floor((reduced100Ms / 10) % 60) }
          </div>
        </div>
        <div className={styles.score}>
          <div className={styles.number}>
            { `${reduced100Ms % 10}00` }
          </div>
        </div>
      </div>
      <div className={styles.buttonBoard}>
        <button
          ref={pauseButtonRef}
          disabled={status === 'Pause'}
          className={classNames(
            styles.button,
            {[styles.disabledButton]: status === 'Pause'}
          )}
        >
          &#10074;&#10074;
        </button>
        <button
          onClick={onPlay}
          disabled={status === 'Play'}
          className={classNames(
            styles.button,
            {[styles.disabledButton]: status === 'Play'}
          )}
        >
          &#9658;
        </button>
        <button
          ref={resetButtonRef}
          disabled={status === 'Stop'}
          className={classNames(
            styles.button,
            {[styles.disabledButton]: status === 'Stop'}
          )}
        >
          Reset
        </button>
      </div>
    </div>
  )
};
