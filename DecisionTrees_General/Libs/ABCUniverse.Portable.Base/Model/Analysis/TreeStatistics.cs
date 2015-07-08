using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Trees.Analysis
{
    public class TreeStatistics
    {
        public int AllCases
        {
            get
            {
                return _hitCount + _missCount + _faCount + _crCount + UndecidedCases;
            }
        }

        public int UndecidedCases
        {
            get
            {
                return _undecidedFailureCount + _undecidedSuccessCount;
            }
        }

        private int _undecidedSuccessCount = 0;
        public int UndecidedSuccessCount
        {
            get
            {
                return _undecidedSuccessCount;
            }
            set
            {
                _undecidedSuccessCount = value;
            }
        }

        private int _undecidedFailureCount = 0;
        public int UndecidedFailureCount
        {
            get
            {
                return _undecidedFailureCount;
            }
            set
            {
                _undecidedFailureCount = value;
            }
        }

        int _hitCount = 0;
        public int HITCount
        {
            get { return _hitCount; }
            set { _hitCount = value; }
        }

        int _missCount = 0;
        public int MISSCount
        {
            get { return _missCount; }
            set { _missCount = value; }
        }

        int _faCount = 0;
        public int FACount
        {
            get { return _faCount; }
            set { _faCount = value; }
        }

        int _crCount = 0;
        public int CRCount
        {
            get { return _crCount; }
            set { _crCount = value; }
        }

        double _stepsSum = 0;
        public double StepsSum
        {
            get { return _stepsSum; }
            set { _stepsSum = value; }
        }

        public double Frugality
        {
            get { return _stepsSum / AllCases; }
        }

        public double GetHitsProbability()
        {
            if (HITCount == 0 && MISSCount == 0)
                return double.NaN;

            if (HITCount == 0)
                return 1.0 / (2 * AllCases);

            if (MISSCount == 0)
                return (1 - 1.0 / (2 * AllCases));

            return (double)HITCount / (double)(HITCount + MISSCount);
        }

        public double GetZofHitsProbability()
        {
            return GetStandardNormalZ(GetHitsProbability());
        }

        public double GetFalseAlarmsProbability()
        {
            if (FACount == 0 && CRCount == 0)
                return double.NaN;

            if (FACount == 0)
                return 1.0 / (2 * AllCases);

            if (CRCount == 0)
                return (1 - 1.0 / (2 * AllCases));

            return (double)FACount / (double)(FACount + CRCount);
        }

        public double GetZofFalseAlarmsProbability()
        {
            return GetStandardNormalZ(GetFalseAlarmsProbability());
        }

        public double GetDPrime()
        {
            return GetZofHitsProbability() - GetZofFalseAlarmsProbability();
        }

        public double GetBias()
        {
            return -0.5 * (GetZofHitsProbability() + GetZofFalseAlarmsProbability());
        }

        public double GetBetaLog()
        {
            return GetDPrime() * GetBias();
        }

        public double GetBeta()
        {
            return Math.Exp(GetBetaLog());
        }

        /// <summary>
        /// FindStandardNormalZ ermittelt zu gegebenen p den entsprechenden Z-Wert
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public static double GetStandardNormalZ(double p)
        {
            double temp_p = 0.0;
            double lfStandardNormalZ = 0.00;
            temp_p = EvaluateStandardNormalZ(lfStandardNormalZ);
            while (temp_p < p)
            {
                lfStandardNormalZ += 0.0001;
                temp_p = EvaluateStandardNormalZ(lfStandardNormalZ);
                if (p - temp_p < 1E-07)
                    break;
            }
            while (temp_p > p)
            {
                lfStandardNormalZ -= 0.0001;
                temp_p = EvaluateStandardNormalZ(lfStandardNormalZ);
                if (temp_p - p < 1E-07)
                    break;
            }
            return lfStandardNormalZ;
        }

        // ===================================================
        // EvaluateStandardNormalZ: einseitige Wahrscheinlich-
        // keit für einen Wert Z der Standardnormalverteilung
        // ===================================================

        static double EvaluateStandardNormalZ(double z)
        {
            double prob = 0.0;
            double temp = 0.0;
            double zt = 0.0;

            zt = z;
            z = Math.Abs(z);
            temp = 1.0 + 0.049867347 * z + 0.0211410061 * Math.Pow(z, 2.0) + 0.0032776263 * Math.Pow(z, 3.0) +
              0.0000380036 * Math.Pow(z, 4.0) + 0.0000488906 * Math.Pow(z, 5.0) + 0.000005383 * Math.Pow(z, 6.0);
            if (zt < 0.0)
                prob = 0.5 * Math.Pow(temp, -16.0);
            else
                prob = 1.0 - (0.5 * Math.Pow(temp, -16.0));

            return prob;
        }

        public double GetAPrime()
        {
            double x = GetFalseAlarmsProbability();
            double y = GetHitsProbability();

            return 0.5 + ((y - x) * (1 + y - x)) / (4 * y * (1.0 - x));
        }

        public double GetBPrime()
        {
            double x = GetFalseAlarmsProbability();
            double y = GetHitsProbability();

            if (y >= 1.0)
                y = 0.999999;
            if (x >= 1.0)
                x = 0.999999;
            if (y <= 0.000000)
                y = 1E-06;
            if (x <= 0.000000)
                x = 1E-06;

            if (x <= 1 - y)
                return 1.0 - ((x * (1 - x)) / (y * (1.0 - y)));
            else
                return ((y * (1.0 - y)) / (x * (1 - x))) - 1.0;
        }

        public double GetBDoublePrime()
        {
            double x = GetFalseAlarmsProbability();
            double y = GetHitsProbability();

            return ((y * (1 - y)) - (x * (1 - x))) / ((y * (1 - y)) + (x * (1 - x)));
        }

        public List<Tuple<double, double>> GetIsosensitivityCurve()
        {
            List<Tuple<double, double>> list = new List<Tuple<double, double>>();
            double aprime = GetAPrime();

            for (double x = 0.000; x <= 1.00; x += 0.005)
            {
                double k = 3 - (4 * (x + (aprime * (1.0 - x))));
                double y = Math.Min(1.0, Math.Sqrt((x * (1 - x)) + Math.Pow((k / 2.0), 2.0)) - (k / 2));
                if (y < 0)
                    y = 0;
                else if (y > 1)
                    y = 1;

                list.Add(new Tuple<double, double>(x, y));
            }
            return list;
        }

        public List<Tuple<double, double>> GetIsobiasCurve(ref bool switchOrientation)
        {
            List<Tuple<double, double>> list = new List<Tuple<double, double>>();
            double bprime = GetBPrime();

            for (double x = 0.000; x <= 1.00; x += 0.005)
            {
                double nom = (x * (1.0 - x));
                double denom = (1 - bprime);
                double division = 0;
                double sqrootContent = 0;

                if (nom != 0.00 || denom != 0.00)
                    division = nom / denom;

                sqrootContent = 0.25 - division;

                if (sqrootContent < 0.00)
                {
                    switchOrientation = true;
                    continue;
                }
                double sqrt = Math.Sqrt(sqrootContent);

                double y1 = 0.5 + sqrt;
                if (y1 < 0)
                    y1 = 0;
                else if (y1 > 1)
                    y1 = 1;

                double y2 = 0.5 - sqrt;
                if (y2 < 0)
                    y2 = 0;
                else if (y2 > 1)
                    y2 = 1;

                list.Add(new Tuple<double, double>(x, y1));
                list.Add(new Tuple<double, double>(x, y2));
            }

            return list;
        }

        public class Tuple<K, V>
        {
            public K x;
            public V y;

            public Tuple(K x, V y)
            {
                this.x = x;
                this.y = y;
            }
        }
    }
}
