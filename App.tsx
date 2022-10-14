import {useCallback, useEffect, memo, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, RefreshControl} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {LoadingView} from 'src/components';
import {api} from 'src/services';
import {colors} from 'src/theme';
import {TCoinResponse} from 'src/types';
import {formatNumberToMoney} from 'src/utils';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.main};
`;

const Title = styled.Text`
  color: ${colors.white};
  font-size: 25px;
`;

const SubTitle = styled.Text<{negative: boolean}>`
  color: ${(props: {negative: boolean}) =>
    props.negative ? colors.error : colors.success};
  font-size: 20px;
`;

const CenteredWrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const LoadingContainer = styled.View`
  width: 100px;
  height: 200px;
  justify-content: center;
  align-items: center;
`;

const SafeWrapper = styled.SafeAreaView`
  flex: 1;
`;

function App() {
  const [data, setData] = useState<TCoinResponse>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setRefreshing(true);
    const res: any = await api('get', 'getCurrencyInfo', {
      id: '1',
    });

    setTimeout(() => {
      setRefreshing(false);
      setData(res.data[1]);
      showMessage({
        duration: 2500,
        message: 'Éxito',
        description: 'La información se ha actualizado',
        type: 'success',
        icon: 'success',
      });
    }, 1500);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Wrapper>
      <StatusBar barStyle={'light-content'} />
      <SafeWrapper>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={colors.white}
              refreshing={refreshing}
              onRefresh={getData}
            />
          }>
          <CenteredWrapper style={styles.contentContainer}>
            <Title>Welcome to </Title>
            <Title>Bitcoin demo</Title>
          </CenteredWrapper>
          {data && (
            <>
              <CenteredWrapper>
                <LoadingContainer>
                  <LoadingView />
                </LoadingContainer>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Current price</Title>
                <SubTitle negative={data.quote.USD.percent_change_1h < 0}>
                  {formatNumberToMoney(data.quote.USD.price)}
                </SubTitle>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Percent change in 1h</Title>
                <SubTitle negative={data.quote.USD.percent_change_1h < 0}>
                  {data.quote.USD.percent_change_1h}%
                </SubTitle>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Percent change in 1h</Title>
                <SubTitle negative={data.quote.USD.percent_change_1h < 0}>
                  {data.quote.USD.percent_change_1h}%
                </SubTitle>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Percent change in last day</Title>
                <SubTitle negative={data.quote.USD.percent_change_24h < 0}>
                  {data.quote.USD.percent_change_24h}%
                </SubTitle>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Percent change in last week</Title>
                <SubTitle negative={data.quote.USD.percent_change_7d < 0}>
                  {data.quote.USD.percent_change_7d}%
                </SubTitle>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Percent change in last month</Title>
                <SubTitle negative={data.quote.USD.percent_change_30d < 0}>
                  {data.quote.USD.percent_change_30d}%
                </SubTitle>
              </CenteredWrapper>
            </>
          )}
          {!data && (
            <>
              <CenteredWrapper>
                <LoadingContainer>
                  <LoadingView />
                </LoadingContainer>
              </CenteredWrapper>
              <CenteredWrapper>
                <Title>Loading info...</Title>
              </CenteredWrapper>
            </>
          )}
        </ScrollView>
      </SafeWrapper>
      <FlashMessage />
    </Wrapper>
  );
}

export default memo(App);
