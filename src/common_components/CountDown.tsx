import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

interface Props {
  startTime: string | undefined;
}

export const CountDown: React.FC<Props> = ({ startTime }) => {
  let tDiff = Math.floor(
    (new Date(`${startTime} UTC`).getTime() - new Date().getTime()) / 1000
  );

  const formatTrem = (s: number) => {
    let h = Math.floor(s / 3600);
    let m = Math.floor((s -= h * 3600) / 60);
    s -= m * 60;
    const cZero = (t: number) => (isNaN(t) ? '--' : `${t < 10 ? 0 : ''}${t}`);
    return { HOURS: cZero(h), MINUTES: cZero(m), SECONDS: cZero(s) };
  };

  const [trem, setTrem] = useState<{ [key: string]: string }>(
    formatTrem(tDiff)
  );

  useEffect(() => {
    setInterval(() => setTrem(formatTrem(--tDiff)), 1000);
  }, []);

  return (
    <>
      {Object.keys(trem).map((t, i) => (
        <Text key={t} style={styles.text}>
          {i === 1 ? `: ${trem[t]} : ` : trem[t]}
          {`\n`}
          <Text style={{ fontSize: 10 }}>{t}</Text>
        </Text>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Regular',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center'
  }
});
