// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { isNil, cloneDeep } from 'lodash';
import { MARKETPLACE_API_URL } from './constants';
import { MarketItem } from '../models/market_item';
import { MARKET_ITEM_LIST } from 'App/utils/constants';
import yaml from 'js-yaml';

export async function listItems(type) {
  if (isNil(type) || type === 'all') {
    return MARKET_ITEM_LIST;
  }
  return MARKET_ITEM_LIST.filter(item => {
    return item.type === type;
  });
}

export async function getItem(itemId) {
  let uri;
  try {
    const item = MARKET_ITEM_LIST.find(item => {
      return item.id === itemId;
    });

    // fetch protocol
    if (item.type === 'old') {
      uri = `https://microsoft.github.io/openpaimarketplace/examples/yaml_templates/${item.protocol}`;
    } else {
      uri = `https://microsoft.github.io/openpaimarketplace/examples/item_protocols/${item.protocol}`;
    }
    const res = await fetch(uri);
    const text = await res.text();
    const protocol = yaml.safeLoad(text);
    const newItem = cloneDeep(item);
    newItem.protocol = protocol;
    return newItem;
  } catch (error) {
    alert(`could not get marketplace item from uri ${uri}`);
  }
}

export async function getApprovedItems() {
  const url = `${MARKETPLACE_API_URL}/items?status=approved`;
  const res = await fetch(url);
  if (res.ok) {
    const items = await res.json();
    // order by updateDate
    items.sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return items;
  } else {
    throw new Error(res.statusText);
  }
}

export async function getPendingItems() {
  const url = `${MARKETPLACE_API_URL}/items?status=pending`;
  const res = await fetch(url);
  if (res.ok) {
    const items = await res.json();
    // order by updateDate
    items.sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return items;
  } else {
    throw new Error(res.statusText);
  }
}

export async function deleteItem(itemId) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}`;
  const res = await fetch(url, {
    method: 'DELETE',
  });
  if (res.ok) {
    return true;
  } else {
    throw new Error(res.statusText);
  }
}

export async function updateItem(
  itemId,
  name,
  author,
  category,
  introduction,
  description,
  jobConfig,
  submits,
  starNumber,
  tags,
) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      author: author,
      category: category,
      introduction: introduction,
      description: description,
      jobConfig: jobConfig,
      submits: submits,
      starNumber: starNumber,
      tags: tags,
    }),
  });
  const text = await res.text();
  if (res.ok) {
    return text;
  } else {
    throw new Error(text);
  }
}

export async function createMarketItem(marketItem) {
  const url = `${MARKETPLACE_API_URL}/items`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: marketItem.name,
      author: marketItem.author,
      category: marketItem.category,
      introduction: marketItem.introduction,
      description: marketItem.description,
      jobConfig: marketItem.jobConfig,
      tags: marketItem.tags,
      status: marketItem.status,
    }),
  });
  if (res.ok) {
    const result = await res.json();
    return result.id;
  } else {
    throw new Error(res.statusText);
  }
}

export async function getItemById(itemId) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}`;
  const res = await fetch(url);
  if (res.ok) {
    const result = await res.json();
    const marketItem = new MarketItem({
      id: result.id,
      name: result.name,
      author: result.author,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      category: result.category,
      tags: result.tags,
      introduction: result.introduction,
      description: result.description,
      jobConfig: result.jobConfig,
      submits: result.submits,
      starNumber: result.starNumber,
      status: result.status,
    });
    return marketItem;
  } else {
    throw new Error(res.statusText);
  }
}

export async function approveItem(itemId) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}/status`;
  const res = await fetch(url, {
    method: 'Put',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: 'approved',
  });
  if (res.ok) {
    return true;
  } else {
    throw new Error(res.statusText);
  }
}

export async function rejectItem(itemId) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}/status`;
  const res = await fetch(url, {
    method: 'Put',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: 'rejected',
  });
  if (res.ok) {
    return true;
  } else {
    throw new Error(res.statusText);
  }
}

export async function increaseSubmits(itemId) {
  const url = `${MARKETPLACE_API_URL}/items/${itemId}/submits`;
  const res = await fetch(url, {
    method: 'Put',
  });
  if (res.ok) {
    return true;
  } else {
    throw new Error(res.statusText);
  }
}

// create if user not exist
export async function ensureUser(user) {
  const url = `${MARKETPLACE_API_URL}/users`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: user,
  });
  if (res.ok) {
    return true;
  } else if (res.status === 409) {
    return false;
  } else {
    throw new Error(res.statusText);
  }
}

export async function getStarStatus(username, itemId) {
  const url = `${MARKETPLACE_API_URL}/users/${username}/starItems/${itemId}`;
  const res = await fetch(url);
  if (res.ok) {
    return true;
  } else if (res.status === 404) {
    return false;
  } else {
    throw new Error(res.statusText);
  }
}

export async function addStar(username, itemId) {
  const url = `${MARKETPLACE_API_URL}/users/${username}/starItems/${itemId}`;
  const res = await fetch(url, {
    method: 'PUT',
  });
  if (res.ok) {
    return true;
  } else if (res.status === 409) {
    return false;
  } else {
    throw new Error(res.statusText);
  }
}

export async function deleteStar(username, itemId) {
  const url = `${MARKETPLACE_API_URL}/users/${username}/starItems/${itemId}`;
  const res = await fetch(url, {
    method: 'DELETE',
  });
  if (res.ok) {
    return true;
  } else if (res.status === 404) {
    return false;
  } else {
    throw new Error(res.statusText);
  }
}
