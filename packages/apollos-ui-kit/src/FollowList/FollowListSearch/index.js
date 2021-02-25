import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import FollowList from '..';
import Search from '../../inputs/Search';
import styled from '../../styled';

const SearchContainer = styled(({ theme }) => ({
  marginHorizontal: theme.sizing.baseUnit,
}))(View);

function FollowListSearch({
  onSearch,
  onHide,
  onConfirm,
  onFollow,
  results = [],
}) {
  const [searchTimeout, setSearchTimeout] = useState();
  const [searchTimer, setSearchTimer] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        onSearch(search);
      }, 500);
      setSearchTimer(false);
      setSearchTimeout(timeout);
    }
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [onSearch, search, searchTimeout, searchTimer]);
  return (
    <>
      <SearchContainer>
        <Search
          showCancelButton={false}
          onChangeText={(value) => {
            setSearch(value);
            setSearchTimer(true);
          }}
        />
      </SearchContainer>
      <FollowList
        followers={results}
        onHide={onHide}
        onConfirm={onConfirm}
        onFollow={onFollow}
      />
    </>
  );
}

FollowListSearch.propTypes = {
  onSearch: PropTypes.func,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.object),
};

FollowListSearch.defaultProps = {
  onSearch: () => {},
  onHide: () => {},
  onConfirm: () => {},
  onFollow: () => {},
  results: [],
};

export default FollowListSearch;
