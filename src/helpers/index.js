import AsyncStorage from '@react-native-community/async-storage';

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getNewId = (existing) => {
  const rand = Math.floor(Math.random() * 10000);
  if (existing && existing.find((x) => x.id === rand)) {
    return getNewId(existing);
  } else {
    return rand;
  }
};

export const cleanWebsite = (text) => {
  // Remove protocol and everything after domain
  return text.split('//').pop().split('/')[0];
};

export const getLogin = async (website) => {
  // 1) Get clean website url
  const cleanURL = cleanWebsite(website);

  // 2) Get master password lists
  const passwords = await getData('passwords');
  if (passwords) {
    return passwords[cleanURL];
  }
  return undefined;
};

export const saveLogin = async ({id, website, username, password}) => {
  // 1) Get clean website url
  const cleanURL = cleanWebsite(website);

  // 2) Get master password lists
  const passwords = await getData('passwords');

  // 3) Create login format
  const login = {
    id: id ?? getNewId((passwords && passwords[cleanURL]) ?? undefined),
    website,
    username,
    password,
  };

  // 4) If existing passwords
  if (passwords) {
    // Already exists
    if (id) {
      const replace = [...passwords[cleanURL]];
      const index = replace.findIndex((x) => x.id === id);
      replace[index] = login;
      return await storeData('passwords', {
        ...passwords,
        [cleanURL]: replace,
      });
    }

    // Save as unique website-username login backup
    await storeData(`${website}${username}`, {
      [cleanURL]: [login],
    });

    // If already a login for site
    if (passwords[cleanURL]) {
      return await storeData('passwords', {
        ...passwords,
        [cleanURL]: [...passwords[cleanURL], login],
      });
    } else {
      return await storeData('passwords', {
        ...passwords,
        [cleanURL]: [login],
      });
    }
  }
  // Otherwise create new
  return await storeData('passwords', {
    [cleanURL]: [login],
  });
};

export const deleteLogin = async ({id, website}) => {
  // 1) Get clean website url
  const cleanURL = cleanWebsite(website);

  // 2) Get master password lists
  const passwords = await getData('passwords');

  // 3) If existing passwords
  if (passwords && id) {
    const replace = [...passwords[cleanURL]];
    const index = replace.findIndex((x) => x.id === id);
    replace.splice(index, 1);
    return await storeData('passwords', {
      ...passwords,
      [cleanURL]: replace,
    });
  }
};
