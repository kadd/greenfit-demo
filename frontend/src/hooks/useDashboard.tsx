import { useState, useEffect } from "react";

import { getDashboardData as getDashboardDataService, updateDashboardData as updateDashboardDataService } from "@/services/dashboard";

export function useDashboard(token: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getDashboardDataService(token);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const updateDashboardData = async (newData: any) => {
    try {
      const result = await updateDashboardDataService(token, newData);
      setData(result);
    } catch (err) {
      setError(err);
    }
  };

  return { data, loading, error, getDashboardDataService, updateDashboardData };
}
