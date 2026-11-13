export function getEntityId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const nested = record.user || record.follower || record.following;
    return String(
      record._id ||
        record.id ||
        (nested && typeof nested === "object"
          ? (nested as Record<string, unknown>)._id || (nested as Record<string, unknown>).id
          : "") ||
        "",
    );
  }
  return "";
}

export function isFollowingUser(following: unknown[] | undefined, userId: string | undefined) {
  if (!following?.length || !userId) return false;
  return following.some((entry) => getEntityId(entry) === userId);
}

export function getFollowTarget(value: any) {
  const target = value?.user || value?.follower || value?.following || value || {};
  const id = getEntityId(value);
  return {
    _id: id,
    name: target?.name || target?.userName || target?.username || "User",
    username: target?.username || target?.userName || "user",
    photo: target?.photo || target?.image || target?.profileImage || "",
  };
}
